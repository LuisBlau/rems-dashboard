export default [
  {
      "_id": "6262cd983e10020e945824c9",
      "id": 8,
      "name": "dir test 1",
      "retailer_id": "common",
      "steps": [
          {
              "type": "shell",
              "cmd": "shell",
              "args": "dir f:"
          }
      ]
  },
  {
      "_id": "62ab2235e5477697c7f43a13",
      "name": "CF-P2-TC6-WrongUnzipName",
      "id": 48,
      "retailer_id": "common",
      "steps": [
          {
              "type": "upload",
              "file": 1,
              "to_location": "adx_imnt:",
              "filename": "sigui.zip"
          },
          {
              "type": "unzip",
              "file": "adx_imnt:wrongname.zip",
              "directory": "adx_imnt:",
              "distribute": "5"
          },
          {
              "type": "apply",
              "command": "apply",
              "product": "AU BB BC",
              "controller_reload": "normal",
              "terminal_load": "true"
          }
      ]
  },
  {
      "_id": "63289da9deddea3c506e28fe",
      "name": "PAS Sky Package",
      "retailer_id": "common",
      "id": 50,
      "steps": [
          {
              "type": "upload",
              "file": 3,
              "to_location": "f:\\",
              "filename": "pas.iso"
          },
          {
              "type": "shell",
              "cmd": "shell",
              "args": "isomount f:\\pas.iso"
          },
          {
              "type": "shell",
              "cmd": "shell",
              "args": "p:\\install.bat"
          },
          {
              "type": "shell",
              "cmd": "shell",
              "args": "isomount -u"
          },
          {
              "type": "apply",
              "command": "apply",
              "product": "GF",
              "controller_reload": "normal",
              "terminal_load": "true"
          }
      ]
  },
  {
      "_id": "637a5198d5f490e5607dc34c",
      "name": "SWD3-TC01-SIGUI",
      "retailer_id": "common",
      "id": 49,
      "steps": [
          {
              "type": "upload",
              "file": 1,
              "to_location": "adx_imnt:",
              "filename": "sigui.zip"
          },
          {
              "type": "unzip",
              "file": "adx_imnt:sigui.zip",
              "directory": "adx_imnt:",
              "distribute": "5"
          },
          {
              "type": "apply",
              "command": "apply",
              "product": "AU BB BC",
              "controller_reload": "normal",
              "terminal_load": "true"
          }
      ]
  },
  {
      "_id": "637b9210e4393c5b8791927b",
      "name": "Upload 1 GB file",
      "retailer_id": "common",
      "id": 41,
      "steps": [
          {
              "type": "upload",
              "file": 32,
              "to_location": "adx_imnt:",
              "filename": "cfinley1GB.bin"
          },
          {
              "type": "shell",
              "cmd": "shell",
              "args": "dir adx_imnt:cfin*"
          }
      ]
  },
  {
      "_id": "637d21840d768d1ea86d1d40",
      "name": "SWD3-BackOffASM",
      "retailer_id": "T0USAVE",
      "id": 35,
      "steps": [
          {
              "type": "apply",
              "command": "backout",
              "product": "AU BB BC",
              "controller_reload": "normal",
              "terminal_load": "true"
          }
      ]
  },
  {
      "_id": "637d283d59bb65b2c8f65feb",
      "name": "SWD3-TC01-SIGUI-Staged",
      "retailer_id": "T0USAVE",
      "id": 36,
      "steps": [
          {
              "type": "upload",
              "file": 19,
              "to_location": "adx_imnt:",
              "filename": "sigui.zip"
          },
          {
              "type": "unzip",
              "file": "adx_imnt:sigui.zip",
              "directory": "adx_imnt:",
              "distribute": "5"
          },
          {
              "type": "apply",
              "command": "apply",
              "product": "AU BB BC",
              "controller_reload": "staged",
              "terminal_load": "true"
          }
      ]
  },
  {
      "_id": "637d330fc80c7db001a67825",
      "name": "SWD3-BackOffASM-Staged",
      "retailer_id": "T0USAVE",
      "id": 37,
      "steps": [
          {
              "type": "apply",
              "command": "backout",
              "product": "AU BB BC",
              "controller_reload": "staged",
              "terminal_load": "true"
          }
      ]
  },
  {
      "_id": "638a11318328e20af0160657",
      "name": "CF_SWD3-TC4.1 !@#$%^&*() Special Characters",
      "retailer_id": "T0USAVE",
      "id": 47,
      "steps": [
          {
              "type": "upload",
              "file": 1,
              "to_location": "adx_imnt:",
              "filename": "sigui.zip"
          },
          {
              "type": "unzip",
              "file": "adx_imnt:sigui.zip",
              "directory": "adx_imnt:",
              "distribute": "5"
          },
          {
              "type": "apply",
              "command": "apply",
              "product": "AU BB BC",
              "controller_reload": "normal",
              "terminal_load": "true"
          }
      ]
  },
  {
      "_id": "638a44708e2a41f8e2182ec4",
      "name": "SWD3-TC01-SIGUI-V2",
      "retailer_id": "T0USAVE",
      "id": 52,
      "steps": [
          {
              "type": "upload",
              "file": 7,
              "to_location": "adx_imnt:",
              "filename": "sigui.zip"
          },
          {
              "type": "unzip",
              "file": "adx_imnt:sigui.zip",
              "directory": "adx_imnt:",
              "distribute": "5"
          },
          {
              "type": "apply",
              "command": "apply",
              "product": "AU BB BC",
              "controller_reload": "normal",
              "terminal_load": "true"
          }
      ]
  },
  {
      "_id": "638a681e0d768d1ea86d1d41",
      "name": "SWD3:Shell:!@#$%^&*",
      "retailer_id": "T0USAVE",
      "id": 44,
      "steps": [
          {
              "type": "shell",
              "cmd": "shell",
              "args": "dir f:"
          }
      ]
  },
  {
      "_id": "643715c4be8d5812c4c3b14c",
      "name": "upload-file-4-12-23-1533cst",
      "retailer_id": "T0USAVE",
      "id": 51,
      "steps": [
          {
              "type": "upload",
              "file": 4,
              "to_location": "f:/somefolder/",
              "filename": "acsv.csv"
          }
      ]
  },
  {
      "_id": "643849d6818f3fd1b8c7cceb",
      "name": "Copy 7 files 4-13-2023",
      "retailer_id": "T0USAVE",
      "id": 57,
      "steps": [
          {
              "type": "upload",
              "file": 1,
              "to_location": "adx_imnt:TEST",
              "filename": "File1.tmp"
          },
          {
              "type": "upload",
              "file": 2,
              "to_location": "adx_imnt:TEST",
              "filename": "File2.tmp"
          },
          {
              "type": "upload",
              "to_location": "adx_imnt:TEST",
              "file": 3,
              "filename": "File3.tmp"
          },
          {
              "type": "upload",
              "to_location": "adx_imnt:TEST",
              "file": 7,
              "filename": "File4.tmp"
          },
          {
              "type": "upload",
              "to_location": "adx_imnt:TEST",
              "file": 8,
              "filename": "File5.tmp"
          },
          {
              "type": "upload",
              "to_location": "adx_imnt:TEST",
              "file": 9,
              "filename": "File6.tmp"
          },
          {
              "type": "upload",
              "to_location": "adx_imnt:TEST",
              "file": 7,
              "filename": "File7.tmp"
          }
      ]
  },
  {
      "_id": "644c24b9a652913eb0682676",
      "name": "test-config",
      "retailer_id": "T0USAVE",
      "id": 58,
      "steps": [
          {
              "type": "shell",
              "args": " listdir ",
              "cmd": "python"
          }
      ]
  }
];
