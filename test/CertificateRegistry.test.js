const { expect } = require("chai");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const hre = require("hardhat");

describe("CertificateRegistry", function () {
  let registry;
  let owner, other;

  const CERT_ID = "CERT-2024-001";
  const CERT_DATA = {
    recipientName: "Alice Johnson",
    courseName: "Blockchain Fundamentals",
    issuer: "Certify Institute",
    certificateHash:
      "bafkreihdwdcefgh4dqkjv67uiefdkarihlocalipfshash",
  };

  beforeEach(async function () {
    [owner, other] = await hre.ethers.getSigners();
    const CertificateRegistry = await hre.ethers.getContractFactory(
      "CertificateRegistry"
    );
    registry = await CertificateRegistry.deploy();
    await registry.waitForDeployment();
  });

  // ─── Test 1: Issue Certificate ───────────────────────────────────────────
  describe("issueCertificate", function () {
    it("should issue a certificate and emit event", async function () {
      await expect(
        registry.issueCertificate(
          CERT_ID,
          CERT_DATA.recipientName,
          CERT_DATA.courseName,
          CERT_DATA.issuer,
          CERT_DATA.certificateHash
        )
      )
        .to.emit(registry, "CertificateIssued")
        .withArgs(
          CERT_ID,
          CERT_DATA.recipientName,
          CERT_DATA.courseName,
          CERT_DATA.issuer,
          // issueDate is block.timestamp — ignore exact value
          anyValue,
          CERT_DATA.certificateHash
        );

      expect(await registry.totalCertificatesIssued()).to.equal(1);
    });

    it("should revert when called by non-owner", async function () {
      await expect(
        registry
          .connect(other)
          .issueCertificate(
            CERT_ID,
            CERT_DATA.recipientName,
            CERT_DATA.courseName,
            CERT_DATA.issuer,
            CERT_DATA.certificateHash
          )
      ).to.be.revertedWithCustomError(registry, "OwnableUnauthorizedAccount");
    });

    it("should revert on empty certificateId", async function () {
      await expect(
        registry.issueCertificate(
          "",
          CERT_DATA.recipientName,
          CERT_DATA.courseName,
          CERT_DATA.issuer,
          CERT_DATA.certificateHash
        )
      ).to.be.revertedWithCustomError(registry, "EmptyField");
    });
  });

  // ─── Test 2: Duplicate Prevention ────────────────────────────────────────
  describe("duplicate prevention", function () {
    it("should prevent issuing a certificate with an existing ID", async function () {
      await registry.issueCertificate(
        CERT_ID,
        CERT_DATA.recipientName,
        CERT_DATA.courseName,
        CERT_DATA.issuer,
        CERT_DATA.certificateHash
      );

      await expect(
        registry.issueCertificate(
          CERT_ID,
          "Bob Smith",
          "Web Development",
          CERT_DATA.issuer,
          "differenthash"
        )
      )
        .to.be.revertedWithCustomError(registry, "CertificateAlreadyExists")
        .withArgs(CERT_ID);
    });
  });

  // ─── Test 3: Verification ────────────────────────────────────────────────
  describe("verifyCertificate", function () {
    it("should return correct certificate data after issuing", async function () {
      await registry.issueCertificate(
        CERT_ID,
        CERT_DATA.recipientName,
        CERT_DATA.courseName,
        CERT_DATA.issuer,
        CERT_DATA.certificateHash
      );

      const cert = await registry.verifyCertificate(CERT_ID);
      expect(cert.certificateId).to.equal(CERT_ID);
      expect(cert.recipientName).to.equal(CERT_DATA.recipientName);
      expect(cert.courseName).to.equal(CERT_DATA.courseName);
      expect(cert.issuer).to.equal(CERT_DATA.issuer);
      expect(cert.certificateHash).to.equal(CERT_DATA.certificateHash);
      expect(cert.isValid).to.equal(true);
    });

    it("should revert when certificate ID does not exist", async function () {
      await expect(
        registry.verifyCertificate("NONEXISTENT-ID")
      ).to.be.revertedWithCustomError(registry, "CertificateNotFound");
    });
  });

  // ─── Test 4: Revocation ─────────────────────────────────────────────────
  describe("revokeCertificate", function () {
    it("should mark certificate as invalid on revoke", async function () {
      await registry.issueCertificate(
        CERT_ID,
        CERT_DATA.recipientName,
        CERT_DATA.courseName,
        CERT_DATA.issuer,
        CERT_DATA.certificateHash
      );

      await expect(registry.revokeCertificate(CERT_ID))
        .to.emit(registry, "CertificateRevoked")
        .withArgs(CERT_ID, anyValue);

      const cert = await registry.verifyCertificate(CERT_ID);
      expect(cert.isValid).to.equal(false);
    });
  });
});
