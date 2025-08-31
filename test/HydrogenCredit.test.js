const HydrogenCredit = artifacts.require("HydrogenCredit");
const { expectRevert } = require('@openzeppelin/test-helpers');
const { BN } = web3.utils;

// Helper function to handle custom errors in OpenZeppelin v5
async function expectRevertCustomError(promise, errorName) {
  try {
    await promise;
    assert.fail("Expected transaction to revert");
  } catch (error) {
    const isCustomError = error.message.includes('Custom error');
    const isStringRevert = error.message.includes(errorName);
    assert(isCustomError || isStringRevert, `Expected revert with ${errorName}, got: ${error.message}`);
  }
}

contract("HydrogenCredit", (accounts) => {
  let token;
  const [owner, certifier, user1, user2] = accounts;

  beforeEach(async () => {
    token = await HydrogenCredit.new("Hydrogen Credit Token", "HCT", { from: owner });

    // Grant certifier role to certifier account
    const CERTIFIER_ROLE = await token.CERTIFIER_ROLE();
    await token.grantRole(CERTIFIER_ROLE, certifier, { from: owner });
  });

  describe("Deployment", () => {
    it("should deploy with correct name and symbol", async () => {
      const name = await token.name();
      const symbol = await token.symbol();
      assert.equal(name, "Hydrogen Credit Token");
      assert.equal(symbol, "HCT");
    });

    it("should set owner as admin", async () => {
      const DEFAULT_ADMIN_ROLE = await token.DEFAULT_ADMIN_ROLE();
      const hasRole = await token.hasRole(DEFAULT_ADMIN_ROLE, owner);
      assert.equal(hasRole, true);
    });
  });

  describe("Role Management", () => {
    it("should allow admin to grant certifier role", async () => {
      const CERTIFIER_ROLE = await token.CERTIFIER_ROLE();
      const hasRole = await token.hasRole(CERTIFIER_ROLE, certifier);
      assert.equal(hasRole, true);
    });

    it("should not allow non-admin to grant roles", async () => {
      const CERTIFIER_ROLE = await token.CERTIFIER_ROLE();
      await expectRevertCustomError(
        token.grantRole(CERTIFIER_ROLE, user2, { from: user1 }),
        "AccessControlUnauthorizedAccount"
      );
    });
  });

  describe("Credit Issuance", () => {
    it("should allow certifier to issue credits", async () => {
      const amount = web3.utils.toWei("100", "ether");
      const hydrogenAmount = new BN(1000);

      await token.issueCredits(
        user1,
        amount,
        "Green Hydrogen Facility A",
        hydrogenAmount,
        "verification_hash_123",
        { from: certifier }
      );

      const balance = await token.balanceOf(user1);
      const totalSupply = await token.totalSupply();
      const totalHydrogen = await token.totalHydrogenProduced();

      assert.equal(balance.toString(), amount);
      assert.equal(totalSupply.toString(), amount);
      assert.equal(totalHydrogen.toString(), hydrogenAmount.toString());
    });

    it("should not allow non-certifier to issue credits", async () => {
      const amount = web3.utils.toWei("100", "ether");

      await expectRevertCustomError(
        token.issueCredits(user1, amount, "Facility", 1000, "hash", { from: user1 }),
        "AccessControlUnauthorizedAccount"
      );
    });

    it("should create correct credit batch", async () => {
      const amount = web3.utils.toWei("100", "ether");
      const hydrogenAmount = new BN(1000);
      const facility = "Green Hydrogen Facility A";
      const hash = "verification_hash_123";

      await token.issueCredits(user1, amount, facility, hydrogenAmount, hash, { from: certifier });

      const batch = await token.getCreditBatch(1);
      assert.equal(batch.id.toString(), "1");
      assert.equal(batch.productionFacility, facility);
      assert.equal(batch.hydrogenAmount.toString(), hydrogenAmount.toString());
      assert.equal(batch.verificationHash, hash);
      assert.equal(batch.isRetired, false);
      assert.equal(batch.certifier, certifier);
    });
  });

  describe("Credit Retirement", () => {
    beforeEach(async () => {
      const amount = web3.utils.toWei("100", "ether");
      await token.issueCredits(user1, amount, "Facility A", 1000, "hash123", { from: certifier });
    });

    it("should allow credit holder to retire credits", async () => {
      const amount = web3.utils.toWei("50", "ether");
      const initialBalance = await token.balanceOf(user1);

      await token.retireCredits(1, amount, { from: user1 });

      const newBalance = await token.balanceOf(user1);
      const batch = await token.getCreditBatch(1);

      assert.equal(new BN(newBalance).toString(), new BN(initialBalance).sub(new BN(amount)).toString());
      assert.equal(batch.isRetired, true);
    });

    it("should not allow retirement with insufficient balance", async () => {
      const amount = web3.utils.toWei("200", "ether");

      await expectRevert(
        token.retireCredits(1, amount, { from: user1 }),
        "Insufficient balance"
      );
    });

    it("should not allow retirement of non-existent batch", async () => {
      const amount = web3.utils.toWei("50", "ether");

      await expectRevert(
        token.retireCredits(999, amount, { from: user1 }),
        "Batch does not exist"
      );
    });
  });

  describe("Pausable Functionality", () => {
    it("should allow pauser to pause contract", async () => {
      const PAUSER_ROLE = await token.PAUSER_ROLE();
      await token.grantRole(PAUSER_ROLE, owner, { from: owner });

      await token.pause({ from: owner });
      const paused = await token.paused();
      assert.equal(paused, true);
    });

    it("should prevent operations when paused", async () => {
      const PAUSER_ROLE = await token.PAUSER_ROLE();
      await token.grantRole(PAUSER_ROLE, owner, { from: owner });
      await token.pause({ from: owner });

      const amount = web3.utils.toWei("100", "ether");

      await expectRevertCustomError(
        token.issueCredits(user1, amount, "Facility", 1000, "hash", { from: certifier }),
        "EnforcedPause"
      );
    });
  });

  describe("View Functions", () => {
    beforeEach(async () => {
      const amount = web3.utils.toWei("100", "ether");
      await token.issueCredits(user1, amount, "Facility A", 1000, "hash123", { from: certifier });
    });

    it("should return user credits", async () => {
      const userCredits = await token.getUserCredits(user1);
      assert.equal(userCredits.length, 1);
      assert.equal(userCredits[0].toString(), "1");
    });

    it("should return correct credit batch details", async () => {
      const batch = await token.getCreditBatch(1);
      assert.equal(batch.productionFacility, "Facility A");
      assert.equal(batch.hydrogenAmount.toString(), "1000");
      assert.equal(batch.verificationHash, "hash123");
    });
  });
});
