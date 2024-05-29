const ABI = [
    {
      inputs: [],
      name: "AccountLocked",
      type: "error",
    },
    {
      inputs: [],
      name: "AccountNotLocked",
      type: "error",
    },
    {
      inputs: [],
      name: "CannotUnlock",
      type: "error",
    },
    {
      inputs: [],
      name: "DuplicatedGuardian",
      type: "error",
    },
    {
      inputs: [],
      name: "DuplicatedProposal",
      type: "error",
    },
    {
      inputs: [],
      name: "DuplicatedRevoke",
      type: "error",
    },
    {
      inputs: [],
      name: "GuardianCannotBeOwner",
      type: "error",
    },
    {
      inputs: [],
      name: "InsecurePeriod",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amountRequired",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "currentBalance",
          type: "uint256",
        },
      ],
      name: "InsufficientBalance",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidParameterLength",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidRecoverySignatures",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidSignatureAmount",
      type: "error",
    },
    {
      inputs: [],
      name: "MustBeGuardian",
      type: "error",
    },
    {
      inputs: [],
      name: "MustSendNativeToken",
      type: "error",
    },
    {
      inputs: [],
      name: "NoOngoingRecovery",
      type: "error",
    },
    {
      inputs: [],
      name: "NotAContract",
      type: "error",
    },
    {
      inputs: [],
      name: "NotOwner",
      type: "error",
    },
    {
      inputs: [],
      name: "NotOwnerOrEntrypoint",
      type: "error",
    },
    {
      inputs: [],
      name: "OngoingRecovery",
      type: "error",
    },
    {
      inputs: [],
      name: "OwnerNotAllowed",
      type: "error",
    },
    {
      inputs: [],
      name: "PendingProposalExpired",
      type: "error",
    },
    {
      inputs: [],
      name: "PendingProposalNotOver",
      type: "error",
    },
    {
      inputs: [],
      name: "PendingRevokeExpired",
      type: "error",
    },
    {
      inputs: [],
      name: "PendingRevokeNotOver",
      type: "error",
    },
    {
      inputs: [],
      name: "UnknownProposal",
      type: "error",
    },
    {
      inputs: [],
      name: "UnknownRevoke",
      type: "error",
    },
    {
      inputs: [],
      name: "ZeroAddressNotAllowed",
      type: "error",
    },
    {
      inputs: [],
      name: "ZeroValueNotAllowed",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "creator",
          type: "address",
        },
      ],
      name: "AccountImplementationDeployed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [],
      name: "EIP712DomainChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "oldEntryPoint",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "newEntryPoint",
          type: "address",
        },
      ],
      name: "EntryPointUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "guardian",
          type: "address",
        },
      ],
      name: "GuardianAdded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "guardian",
          type: "address",
        },
      ],
      name: "GuardianProposalCancelled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "guardian",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "executeAfter",
          type: "uint256",
        },
      ],
      name: "GuardianProposed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "guardian",
          type: "address",
        },
      ],
      name: "GuardianRevocationCancelled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "guardian",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "executeAfter",
          type: "uint256",
        },
      ],
      name: "GuardianRevocationRequested",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "guardian",
          type: "address",
        },
      ],
      name: "GuardianRevoked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint8",
          name: "version",
          type: "uint8",
        },
      ],
      name: "Initialized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bool",
          name: "isLocked",
          type: "bool",
        },
      ],
      name: "Locked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferStarted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "recoveryAddress",
          type: "address",
        },
      ],
      name: "RecoveryCancelled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "recoveryAddress",
          type: "address",
        },
      ],
      name: "RecoveryCompleted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "recoveryAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint64",
          name: "executeAfter",
          type: "uint64",
        },
      ],
      name: "RecoveryExecuted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "key",
          type: "address",
        },
      ],
      name: "SessionKeyRegistered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "key",
          type: "address",
        },
      ],
      name: "SessionKeyRevoked",
      type: "event",
    },
    {
      inputs: [],
      name: "acceptOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_guardian",
          type: "address",
        },
      ],
      name: "cancelGuardianProposal",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_guardian",
          type: "address",
        },
      ],
      name: "cancelGuardianRevocation",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "cancelRecovery",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes[]",
          name: "_signatures",
          type: "bytes[]",
        },
      ],
      name: "completeRecovery",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_guardian",
          type: "address",
        },
      ],
      name: "confirmGuardianProposal",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_guardian",
          type: "address",
        },
      ],
      name: "confirmGuardianRevocation",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "eip712Domain",
      outputs: [
        {
          internalType: "bytes1",
          name: "fields",
          type: "bytes1",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "version",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "chainId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "verifyingContract",
          type: "address",
        },
        {
          internalType: "bytes32",
          name: "salt",
          type: "bytes32",
        },
        {
          internalType: "uint256[]",
          name: "extensions",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "entryPoint",
      outputs: [
        {
          internalType: "contract IEntryPoint",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "dest",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "func",
          type: "bytes",
        },
      ],
      name: "execute",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "_target",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "_value",
          type: "uint256[]",
        },
        {
          internalType: "bytes[]",
          name: "_calldata",
          type: "bytes[]",
        },
      ],
      name: "executeBatch",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [],
      name: "getDeposit",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getGuardians",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getLock",
      outputs: [
        {
          internalType: "uint256",
          name: "_releaseAfter",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getNonce",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "guardianCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_defaultAdmin",
          type: "address",
        },
        {
          internalType: "address",
          name: "_entrypoint",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_recoveryPeriod",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_securityPeriod",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_securityWindow",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_lockPeriod",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_initialGuardian",
          type: "address",
        },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_guardian",
          type: "address",
        },
      ],
      name: "isGuardian",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "isLocked",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "_hash",
          type: "bytes32",
        },
        {
          internalType: "bytes",
          name: "_signature",
          type: "bytes",
        },
      ],
      name: "isValidSignature",
      outputs: [
        {
          internalType: "bytes4",
          name: "",
          type: "bytes4",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "lock",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
        },
      ],
      name: "onERC1155BatchReceived",
      outputs: [
        {
          internalType: "bytes4",
          name: "",
          type: "bytes4",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
        },
      ],
      name: "onERC1155Received",
      outputs: [
        {
          internalType: "bytes4",
          name: "",
          type: "bytes4",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
        },
      ],
      name: "onERC721Received",
      outputs: [
        {
          internalType: "bytes4",
          name: "",
          type: "bytes4",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "pendingOwner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_guardian",
          type: "address",
        },
      ],
      name: "proposeGuardian",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "recoveryDetails",
      outputs: [
        {
          internalType: "address",
          name: "recoveryAddress",
          type: "address",
        },
        {
          internalType: "uint64",
          name: "executeAfter",
          type: "uint64",
        },
        {
          internalType: "uint32",
          name: "guardiansRequired",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_key",
          type: "address",
        },
        {
          internalType: "uint48",
          name: "_validAfter",
          type: "uint48",
        },
        {
          internalType: "uint48",
          name: "_validUntil",
          type: "uint48",
        },
        {
          internalType: "uint48",
          name: "_limit",
          type: "uint48",
        },
        {
          internalType: "address[]",
          name: "_whitelist",
          type: "address[]",
        },
      ],
      name: "registerSessionKey",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_guardian",
          type: "address",
        },
      ],
      name: "revokeGuardian",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_key",
          type: "address",
        },
      ],
      name: "revokeSessionKey",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "sessionKey",
          type: "address",
        },
      ],
      name: "sessionKeys",
      outputs: [
        {
          internalType: "uint48",
          name: "validAfter",
          type: "uint48",
        },
        {
          internalType: "uint48",
          name: "validUntil",
          type: "uint48",
        },
        {
          internalType: "uint48",
          name: "limit",
          type: "uint48",
        },
        {
          internalType: "bool",
          name: "masterSessionKey",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "whitelisting",
          type: "bool",
        },
        {
          internalType: "address",
          name: "registrarAddress",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_recoveryAddress",
          type: "address",
        },
      ],
      name: "startRecovery",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
        },
        {
          internalType: "bytes",
          name: "",
          type: "bytes",
        },
      ],
      name: "tokensReceived",
      outputs: [],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "unlock",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "nonce",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "initCode",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "callData",
              type: "bytes",
            },
            {
              internalType: "uint256",
              name: "callGasLimit",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "verificationGasLimit",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "preVerificationGas",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "maxFeePerGas",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "maxPriorityFeePerGas",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "paymasterAndData",
              type: "bytes",
            },
            {
              internalType: "bytes",
              name: "signature",
              type: "bytes",
            },
          ],
          internalType: "struct UserOperation",
          name: "userOp",
          type: "tuple",
        },
        {
          internalType: "bytes32",
          name: "userOpHash",
          type: "bytes32",
        },
        {
          internalType: "uint256",
          name: "missingAccountFunds",
          type: "uint256",
        },
      ],
      name: "validateUserOp",
      outputs: [
        {
          internalType: "uint256",
          name: "validationData",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  export default ABI;