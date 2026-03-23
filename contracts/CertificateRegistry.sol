// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CertificateRegistry
 * @dev Blockchain-based certificate issuance and verification system.
 * Only the owner (admin) can issue certificates.
 * Anyone can verify a certificate by its ID.
 */
contract CertificateRegistry is Ownable {
    // ─────────────────────────────────────────────────────────────────────────
    //  Data Structures
    // ─────────────────────────────────────────────────────────────────────────

    struct Certificate {
        string  certificateId;   // Unique certificate identifier
        string  recipientName;   // Name of the certificate recipient
        string  courseName;      // Name of the course / program
        string  issuer;          // Issuing organization name
        uint256 issueDate;       // Unix timestamp of issuance
        string  certificateHash; // SHA-256 or IPFS hash of the original document
        bool    isValid;         // False if the certificate was revoked
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Storage
    // ─────────────────────────────────────────────────────────────────────────

    /// @dev Maps certificateId → Certificate struct
    mapping(string => Certificate) private _certificates;

    /// @dev Quick existence check (avoids reading the whole struct)
    mapping(string => bool) private _exists;

    /// @dev Total certificates issued (informational)
    uint256 public totalCertificatesIssued;

    // ─────────────────────────────────────────────────────────────────────────
    //  Events
    // ─────────────────────────────────────────────────────────────────────────

    event CertificateIssued(
        string  indexed certificateId,
        string  recipientName,
        string  courseName,
        string  issuer,
        uint256 issueDate,
        string  certificateHash
    );

    event CertificateRevoked(
        string indexed certificateId,
        uint256 revokedAt
    );

    // ─────────────────────────────────────────────────────────────────────────
    //  Custom Errors (gas-efficient)
    // ─────────────────────────────────────────────────────────────────────────

    error CertificateAlreadyExists(string certificateId);
    error CertificateNotFound(string certificateId);
    error EmptyField(string fieldName);

    // ─────────────────────────────────────────────────────────────────────────
    //  Constructor
    // ─────────────────────────────────────────────────────────────────────────

    constructor() Ownable(msg.sender) {}

    // ─────────────────────────────────────────────────────────────────────────
    //  Admin Functions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Issue a new certificate. Only callable by the contract owner.
     * @param certificateId    Unique ID for this certificate (e.g. "CERT-2024-001")
     * @param recipientName    Full name of the recipient
     * @param courseName       Name of the course / certification
     * @param issuer           Name of the issuing organization
     * @param certificateHash  SHA-256 hash or IPFS CID of the certificate document
     */
    function issueCertificate(
        string calldata certificateId,
        string calldata recipientName,
        string calldata courseName,
        string calldata issuer,
        string calldata certificateHash
    ) external onlyOwner {
        // Input validation
        if (bytes(certificateId).length   == 0) revert EmptyField("certificateId");
        if (bytes(recipientName).length   == 0) revert EmptyField("recipientName");
        if (bytes(courseName).length      == 0) revert EmptyField("courseName");
        if (bytes(issuer).length          == 0) revert EmptyField("issuer");
        if (bytes(certificateHash).length == 0) revert EmptyField("certificateHash");

        // Duplicate prevention
        if (_exists[certificateId]) revert CertificateAlreadyExists(certificateId);

        // Store
        _certificates[certificateId] = Certificate({
            certificateId:   certificateId,
            recipientName:   recipientName,
            courseName:      courseName,
            issuer:          issuer,
            issueDate:       block.timestamp,
            certificateHash: certificateHash,
            isValid:         true
        });

        _exists[certificateId] = true;
        unchecked { totalCertificatesIssued++; }

        emit CertificateIssued(
            certificateId,
            recipientName,
            courseName,
            issuer,
            block.timestamp,
            certificateHash
        );
    }

    /**
     * @notice Revoke a certificate (marks isValid = false). Only owner.
     * @param certificateId The ID of the certificate to revoke.
     */
    function revokeCertificate(string calldata certificateId) external onlyOwner {
        if (!_exists[certificateId]) revert CertificateNotFound(certificateId);
        _certificates[certificateId].isValid = false;
        emit CertificateRevoked(certificateId, block.timestamp);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Public View Functions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Verify and retrieve full certificate details.
     * @param certificateId The unique certificate ID to look up.
     * @return cert The full Certificate struct.
     */
    function verifyCertificate(string calldata certificateId)
        external
        view
        returns (Certificate memory cert)
    {
        if (!_exists[certificateId]) revert CertificateNotFound(certificateId);
        return _certificates[certificateId];
    }

    /**
     * @notice Quick existence check — does this certificate ID exist?
     */
    function certificateExists(string calldata certificateId) external view returns (bool) {
        return _exists[certificateId];
    }
}
