// Minimal ABI — only the functions/events the frontend needs
const CertificateRegistryABI = [
  // ── Write ──────────────────────────────────────────────────────────
  {
    inputs: [
      { internalType: "string", name: "certificateId", type: "string" },
      { internalType: "string", name: "recipientName", type: "string" },
      { internalType: "string", name: "courseName", type: "string" },
      { internalType: "string", name: "issuer", type: "string" },
      { internalType: "string", name: "certificateHash", type: "string" },
    ],
    name: "issueCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "certificateId", type: "string" },
    ],
    name: "revokeCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // ── Read ───────────────────────────────────────────────────────────
  {
    inputs: [
      { internalType: "string", name: "certificateId", type: "string" },
    ],
    name: "verifyCertificate",
    outputs: [
      {
        components: [
          { internalType: "string", name: "certificateId", type: "string" },
          { internalType: "string", name: "recipientName", type: "string" },
          { internalType: "string", name: "courseName", type: "string" },
          { internalType: "string", name: "issuer", type: "string" },
          { internalType: "uint256", name: "issueDate", type: "uint256" },
          {
            internalType: "string",
            name: "certificateHash",
            type: "string",
          },
          { internalType: "bool", name: "isValid", type: "bool" },
        ],
        internalType: "struct CertificateRegistry.Certificate",
        name: "cert",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "certificateId", type: "string" },
    ],
    name: "certificateExists",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalCertificatesIssued",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // ── Events ─────────────────────────────────────────────────────────
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "certificateId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "recipientName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "courseName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "issuer",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "issueDate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "certificateHash",
        type: "string",
      },
    ],
    name: "CertificateIssued",
    type: "event",
  },
] as const;

export default CertificateRegistryABI;
