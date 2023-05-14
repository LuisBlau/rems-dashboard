export default [
  {
    "_id": "644f1d3cb347f1dd302bc4ad",
    "id": 577,
    "retailer_id": "T0USAVE",
    "config_id": 58,
    "apply_time": "2023/04/30 22:15:49",
    "storeName": "PAS QA Lab 4000",
    "agentName": "PAS QA Lab 4000-PG",
    "status": "Initial",
    "steps": [
      {
        "type": "shell",
        "args": " listdir ",
        "cmd": "python",
        "status": "Initial",
        "output": []
      }
    ],
    "package": "test-config"
  },
  {
    "_id": "644c4578db52c85580420274",
    "id": 576,
    "retailer_id": "T0USAVE",
    "config_id": 58,
    "apply_time": "2023/04/28 18:30:54",
    "storeName": "PAS QA Lab 4000",
    "agentName": "PAS QA Lab 4000-PG",
    "status": "Initial",
    "steps": [
      {
        "type": "shell",
        "args": " listdir ",
        "cmd": "python",
        "status": "Initial",
        "output": []
      }
    ],
    "package": "test-config"
  },
  {
    "_id": "643990e7a93805284e250fa9",
    "id": 520,
    "retailer_id": "T0USAVE",
    "config_id": 57,
    "apply_time": "2023/04/14 14:00:00",
    "storeName": "PAS QA Lab 4000",
    "agentName": "PAS QA Lab 4000-PG",
    "status": "Failed",
    "steps": [
      {
        "type": "upload",
        "file": 1,
        "to_location": "adx_imnt:TEST",
        "filename": "File1.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "file": 2,
        "to_location": "adx_imnt:TEST",
        "filename": "File2.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:TEST",
        "file": 3,
        "filename": "File3.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:TEST",
        "file": 7,
        "filename": "File4.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:TEST",
        "file": 8,
        "filename": "File5.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:TEST",
        "file": 9,
        "filename": "File6.tmp",
        "status": "Failed",
        "output": [
          "The file deployment has failed with an exception of: java.io.FileNotFoundException: \"f:\\rma\\user\\rma\\data\\softdist\\9.upload\", FLEXOSEXCEPTION (rc=0x805c4010) File not found"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:TEST",
        "file": 7,
        "filename": "File7.tmp",
        "status": "Initial",
        "output": []
      }
    ],
    "package": "Copy 7 files 4-13-2023"
  },
  {
    "_id": "64396996a93805284e250fa8",
    "id": 519,
    "retailer_id": "T0USAVE",
    "config_id": 56,
    "apply_time": "2023/04/14 11:06:46",
    "storeName": "PAS QA Lab 4000",
    "agentName": "PAS QA Lab 4000-PG",
    "status": "Failed",
    "steps": [
      {
        "type": "upload",
        "file": 1,
        "to_location": "adx_imnt:",
        "filename": "File1.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "file": 2,
        "to_location": "adx_imnt:",
        "filename": "File2.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:",
        "file": 3,
        "filename": "File3.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:TEST",
        "file": 7,
        "filename": "File4.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:\\TEST",
        "file": 8,
        "filename": "File5.tmp",
        "status": "Failed",
        "output": [
          "The file deployment has failed with an exception of: java.io.FileNotFoundException: \"f:\\rma\\user\\rma\\data\\softdist\\8.upload\", FLEXOSEXCEPTION (rc=0x805c4010) File not found"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:",
        "file": 9,
        "filename": "File6.tmp",
        "status": "Initial",
        "output": []
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:",
        "file": 7,
        "filename": "File7.tmp",
        "status": "Initial",
        "output": []
      }
    ],
    "package": "Copy 7 files 4-13-2023"
  },
  {
    "_id": "643863c3a93805284e250fa6",
    "id": 518,
    "retailer_id": "T0USAVE",
    "config_id": 35,
    "apply_time": "2023/04/13 16:40:00",
    "storeName": "PAS QA Lab 4000",
    "agentName": "PAS QA Lab 4000-PG",
    "status": "Success",
    "steps": [
      {
        "type": "apply",
        "command": "backout",
        "product": "AU BB BC",
        "controller_reload": "normal",
        "terminal_load": "true",
        "status": "Success",
        "output": [
          "",
          "RUNNING  16:39:59 ADXCST0L Y 2AU  2BB  2BC  TL                                  ",
          "IPL.\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
          "SUCCESS  16:39:59 ADXCST0L Y 2AU  2BB  2BC  TL                                    ",
          "                                                                                ",
          "                                                                                ",
          "RUNNING  16:40:19 ADXILT0L adx_ipgm:ADXCATUD.DAT C                                ",
          "RUNNING  16:40:19 ADXILT0L adx_ipgm:ADXCBTBD.DAT C                                ",
          "RUNNING  16:40:19 ADXILT0L adx_ipgm:ADXCBTCD.DAT C                                ",
          "SUCCESS  16:40:20 ADXILT0L adx_ipgm:ADXCATUD.DAT C                                ",
          "SUCCESS  16:40:20 ADXILT0L adx_ipgm:ADXCBTBD.DAT C                                ",
          "SUCCESS  16:40:20 ADXILT0L adx_ipgm:ADXCBTCD.DAT C                                ",
          "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000"
        ]
      }
    ],
    "package": "SWD3-BackOffASM"
  },
  {
    "_id": "64385dcfa93805284e250fa5",
    "id": 517,
    "retailer_id": "T0USAVE",
    "config_id": 52,
    "apply_time": "2023/04/13 16:20:00",
    "storeName": "PAS QA Lab 4000",
    "agentName": "PAS QA Lab 4000-PG",
    "status": "Success",
    "steps": [
      {
        "type": "upload",
        "file": 7,
        "to_location": "adx_imnt:",
        "filename": "sigui.zip",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "unzip",
        "file": "adx_imnt:sigui.zip",
        "directory": "adx_imnt:",
        "distribute": "5",
        "status": "Success",
        "output": [
          "adxnszzl - Version 3.7.2 - May  1 2020 12:53:17",
          "  tool code Copyright (c) 2003,2020 Toshiba Global Commerce Solutions Inc",
          "  zlib code Copyright (c) 1995-2002 Jean-loup Gailly and Mark Adler",
          "",
          "Archive: adx_imnt:sigui.zip",
          "Inflating : c:/ADX_IMNT/APSINSTA.LOG (2957 bytes)...Done",
          "Inflating : c:/ADX_IMNT/BCKNAMES.XML (6165 bytes)...Done",
          "Inflating : c:/ADX_IMNT/CFGUTIL.OUT (1106 bytes)...Done",
          "Inflating : c:/ADX_IMNT/DIF (1331 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z00 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z01 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z02 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z03 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z04 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z05 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z06 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z07 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z08 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z09 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z10 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z11 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z12 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z13 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z14 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z15 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z16 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.ZIP (869966 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMINSTA.LOG (38003 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMS$000.NEW (1488 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMS@000.NEW (8284 bytes)...Done",
          "Inflating : c:/ADX_IMNT/MIGEPS.BAT (8941 bytes)...Done",
          "Inflating : c:/ADX_IMNT/PCFCHECK.ACE (486 bytes)...Done",
          "Inflating : c:/ADX_IMNT/PCFCHECK.EPS (486 bytes)...Done",
          "Inflating : c:/ADX_IMNT/RMTACE.BAT (8483 bytes)...Done",
          "Inflating : c:/ADX_IMNT/RMTEPS.BAT (4070 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXCBTCD.DAT (221 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SISECURE.BAT (430 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIUTIL.JAR (210392 bytes)...Done",
          "Inflating : c:/ADX_IMNT/CMCOMPAT.JAR (41012 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXEBBCF.DAT (17 bytes)...Done",
          "Inflating : c:/ADX_IMNT/INSTALL.JAR (27171 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXXTDAT.DAT (7389461 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXXTDPT.DAT (11110435 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFACE.JAR (638918 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXEABUF.DAT (17 bytes)...Done",
          "Inflating : c:/ADX_IMNT/J.PRO (2200 bytes)...Done",
          "Inflating : c:/ADX_IMNT/POSPROV.JAR (385511 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEF.JAR (2204182 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFSYS.JAR (5937536 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFIO.JAR (1246675 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SILAUNCH.JAR (26894 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SICOMPAT.JAR (242675 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIJIOP.JAR (223594 bytes)...Done",
          "Inflating : c:/ADX_IMNT/CSS.JAR (99223 bytes)...Done",
          "Inflating : c:/ADX_IMNT/CSSJ6PAT.BAT (441 bytes)...Done",
          "Inflating : c:/ADX_IMNT/POSBC.JAR (382719 bytes)...Done",
          "Inflating : c:/ADX_IMNT/BC.JAR (182021 bytes)...Done",
          "Inflating : c:/ADX_IMNT/BC_API.JAR (2184377 bytes)...Done",
          "Inflating : c:/ADX_IMNT/PML.JAR (180013 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIDBG.PRO (4663 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFVIRT.TXT (629 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFVIRT.J6 (1395 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMINLOGS.PRO (3400 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMINLOGS.J6 (3424 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMIDLOGS.PRO (4077 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMIDLOGS.J6 (4177 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMAXLOGS.PRO (3283 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMAXLOGS.J6 (3398 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXCATUZ.DAT (1479 bytes)...Done",
          "Inflating : c:/ADX_IMNT/POSTSI_F.DAT (399 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIIBM.JAR (335 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIUSER.JAR (2425 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIBUSP.JAR (335 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SICOMP.JAR (335 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SISTORE.JAR (824 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFLOAD.PRO (3543 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXCATUD.DAT (1121 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVSA.JAR (539430 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXXTDGA.DAT (17278988 bytes)...Done",
          "Inflating : c:/ADX_IMNT/JCST1.PRO (1021 bytes)...Done",
          "Inflating : c:/ADX_IMNT/DD.PRO (2404 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVACE.JAR (224922 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXEBBBF.DAT (17 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SUREVIEW.JAR (4367726 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVRMI.JAR (50758 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLOG.PRO (3889 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLOGDBG.PRO (4108 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLOGMID.PRO (4488 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLG2.PRO (4014 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLG2DBG.PRO (4249 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLG2MID.PRO (4597 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SILVER.JAR (7375127 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVIBM.JAR (335 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVUSER.JAR (1229860 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVBUSP.JAR (16070 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVSTORE.JAR (335 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVCOMP.JAR (611799 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXCBTBD.DAT (671 bytes)...Done"
        ]
      },
      {
        "type": "apply",
        "command": "apply",
        "product": "AU BB BC",
        "controller_reload": "normal",
        "terminal_load": "true",
        "status": "Success",
        "output": [
          "",
          "RUNNING  16:20:48 ADXCST0L Y 1AU  1BB  1BC  TL                                  ",
          "IPL.\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
          "SUCCESS  16:20:49 ADXCST0L Y 1AU  1BB  1BC  TL                                    ",
          "                                                                                ",
          "                                                                                ",
          "RUNNING  16:21:08 ADXILT0L adx_ipgm:ADXCATUD.DAT T                                ",
          "RUNNING  16:21:09 ADXILT0L adx_ipgm:ADXCBTBD.DAT T                                ",
          "RUNNING  16:21:09 ADXILT0L adx_ipgm:ADXCBTCD.DAT T                                ",
          "SUCCESS  16:21:09 ADXILT0L adx_ipgm:ADXCATUD.DAT T                                ",
          "SUCCESS  16:21:09 ADXILT0L adx_ipgm:ADXCBTBD.DAT T                                ",
          "SUCCESS  16:21:09 ADXILT0L adx_ipgm:ADXCBTCD.DAT T                                ",
          "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000"
        ]
      }
    ],
    "package": "SWD3-TC01-SIGUI-V2"
  },
  {
    "_id": "64385da7a93805284e250fa4",
    "id": 516,
    "retailer_id": "T0USAVE",
    "config_id": 55,
    "apply_time": "2023/04/13 16:10:00",
    "storeName": "PAS QA Lab 4000",
    "agentName": "PAS QA Lab 4000-PG",
    "status": "Failed",
    "steps": [
      {
        "type": "upload",
        "file": 1,
        "to_location": "adx_imnt:",
        "filename": "File1.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "file": 2,
        "to_location": "adx_imnt:",
        "filename": "File2.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:",
        "file": 3,
        "filename": "File3.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:TEST",
        "file": 4,
        "filename": "File4.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:\\TEST",
        "file": 5,
        "filename": "File5.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:",
        "file": 6,
        "filename": "File6.tmp",
        "status": "Failed",
        "output": [
          "The file deployment has failed with an exception of: java.io.FileNotFoundException: \"f:\\rma\\user\\rma\\data\\softdist\\6.upload\", FLEXOSEXCEPTION (rc=0x805c4010) File not found"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:",
        "file": 7,
        "filename": "File7.tmp",
        "status": "Initial",
        "output": []
      }
    ],
    "package": "Copy 7 files 4-13-2023"
  },
  {
    "_id": "643850d2a93805284e250fa3",
    "id": 515,
    "retailer_id": "T0USAVE",
    "config_id": 54,
    "apply_time": "2023/04/13 15:18:00",
    "storeName": "PAS QA Lab 4000",
    "agentName": "PAS QA Lab 4000-PG",
    "status": "Failed",
    "steps": [
      {
        "type": "upload",
        "file": 1,
        "to_location": "adx_imnt:",
        "filename": "File1.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "file": 2,
        "to_location": "adx_imnt:",
        "filename": "File2.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:",
        "file": 3,
        "filename": "File3.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:",
        "file": 4,
        "filename": "File4.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:",
        "file": 5,
        "filename": "File5.tmp",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:",
        "file": 6,
        "filename": "File6.tmp",
        "status": "Failed",
        "output": [
          "The file deployment has failed with an exception of: java.io.FileNotFoundException: \"f:\\rma\\user\\rma\\data\\softdist\\6.upload\", FLEXOSEXCEPTION (rc=0x805c4010) File not found"
        ]
      },
      {
        "type": "upload",
        "to_location": "adx_imnt:",
        "file": 7,
        "filename": "File7.tmp",
        "status": "Initial",
        "output": []
      }
    ],
    "package": "Copy 7 files 4-13-2023"
  },
  {
    "_id": "643849faa93805284e250fa2",
    "id": 514,
    "retailer_id": "T0USAVE",
    "config_id": 53,
    "apply_time": "2023/04/13 14:48:00",
    "storeName": "PAS QA Lab 4000",
    "agentName": "PAS QA Lab 4000-PG",
    "status": "Failed",
    "steps": [
      {
        "type": "upload",
        "file": 1,
        "to_location": "ADX-IMNT:",
        "filename": "File1.tmp",
        "status": "Failed",
        "output": [
          "The file deployment has failed with an exception of: java.io.IOException: \"ADX-IMNT:File1.tmp\", FLEXOSEXCEPTION (rc=0x80004005)"
        ]
      },
      {
        "type": "upload",
        "file": 2,
        "to_location": "ADX-IMNT:",
        "filename": "File2.tmp",
        "status": "Initial",
        "output": []
      },
      {
        "type": "upload",
        "to_location": "ADX-IMNT:",
        "file": 3,
        "filename": "File3.tmp",
        "status": "Initial",
        "output": []
      },
      {
        "type": "upload",
        "to_location": "ADX-IMNT:",
        "file": 4,
        "filename": "File4.tmp",
        "status": "Initial",
        "output": []
      },
      {
        "type": "upload",
        "to_location": "ADX-IMNT:",
        "file": 5,
        "filename": "File5.tmp",
        "status": "Initial",
        "output": []
      },
      {
        "type": "upload",
        "to_location": "ADX-IMNT:",
        "file": 6,
        "filename": "File6.tmp",
        "status": "Initial",
        "output": []
      },
      {
        "type": "upload",
        "to_location": "ADX-IMNT:",
        "file": 7,
        "filename": "File7.tmp",
        "status": "Initial",
        "output": []
      }
    ],
    "package": "Copy 7 files 4-13-2023"
  },
  {
    "_id": "64383f21a93805284e250fa1",
    "id": 513,
    "retailer_id": "T0USAVE",
    "config_id": 52,
    "apply_time": "2023/04/13 13:52:00",
    "storeName": "PAS QA Lab 4000",
    "agentName": "PAS QA Lab 4000-PG",
    "status": "Failed",
    "steps": [
      {
        "type": "upload",
        "file": 7,
        "to_location": "adx_imnt:",
        "filename": "sigui.zip",
        "status": "Failed",
        "output": [
          "The file deployment has failed with an exception of: java.io.FileNotFoundException: \"f:\\rma\\user\\rma\\data\\softdist\\7.upload\", FLEXOSEXCEPTION (rc=0x805c4010) File not found"
        ]
      },
      {
        "type": "unzip",
        "file": "adx_imnt:sigui.zip",
        "directory": "adx_imnt:",
        "distribute": "5",
        "status": "Pending",
        "output": []
      },
      {
        "type": "apply",
        "command": "apply",
        "product": "AU BB BC",
        "controller_reload": "normal",
        "terminal_load": "true",
        "status": "Pending",
        "output": []
      }
    ],
    "package": "SWD3-TC01-SIGUI-V2"
  },
  {
    "_id": "64383bc38c8ded5e07eece56",
    "id": 512,
    "retailer_id": "T0USAVE",
    "config_id": 8,
    "apply_time": "2023/04/13 13:38:00",
    "storeName": "Elera Store",
    "agentName": "Elera Store-PG",
    "status": "Success",
    "steps": [
      {
        "type": "shell",
        "cmd": "shell",
        "args": "dir f:",
        "status": "Success",
        "output": [
          "",
          "  Volume in drive vf: has no label ",
          "  Directory of vf:/rma/",
          "",
          "   4-12-2022  11:21p      3225  rmaCollect.bat",
          "   3-30-2023  11:32a      3233  RMAInventory.xml",
          "   4-07-2023   4:41p      3285  rmaLogs.bat",
          "   4-10-2023   1:17p      5498  rmasvc.bat",
          "   4-13-2023  11:57a  <DIR>     logs",
          "   4-13-2023   1:32p         0  extfile.txt",
          "   4-07-2023   4:41p      6936  rmaLogs.py",
          "   4-12-2022  11:21p      5382  rmastartfo.bat",
          "   4-07-2023   4:41p  <DIR>     ot",
          "  11-30-2021   2:51p  <DIR>     user",
          "   4-10-2023   1:17p  <DIR>     .",
          "   3-30-2023  11:32a  <DIR>     license",
          "   4-10-2023   1:17p      5593  rmastart.bat",
          "   4-07-2023   4:38p  <DIR>     ..",
          "   2-08-2022   1:52p      4933  rmadbg.bat",
          "   4-12-2022  11:21p      1908  rmamaint.bat",
          "   4-12-2022  11:21p      2640  rmacli.bat",
          "   3-30-2023  11:32a  <DIR>     lib",
          "",
          "          18 Files   50531392 KB free"
        ]
      }
    ],
    "package": "dir test 1"
  },
  {
    "_id": "64383bc38c8ded5e07eece55",
    "id": 511,
    "retailer_id": "T0USAVE",
    "config_id": 8,
    "apply_time": "2023/04/13 13:38:00",
    "storeName": "PAS QA Lab 4000",
    "agentName": "PAS QA Lab 4000-PG",
    "status": "Cancelled",
    "steps": [
      {
        "type": "shell",
        "cmd": "shell",
        "args": "dir f:",
        "status": "Pending",
        "output": []
      }
    ],
    "package": "dir test 1"
  },
  {
    "_id": "643836e98c8ded5e07eece54",
    "id": 510,
    "retailer_id": "T0USAVE",
    "config_id": 8,
    "apply_time": "2023/04/13 13:17:00",
    "storeName": "PAS QA Lab 4000",
    "agentName": "PAS QA Lab 4000-PG",
    "status": "Success",
    "steps": [
      {
        "type": "shell",
        "cmd": "shell",
        "args": "dir f:",
        "status": "Success",
        "output": [
          "",
          "  Volume in drive vf: has no label ",
          "  Directory of vf:/rma/",
          "",
          "   4-12-2023   4:26p  <DIR>     .",
          "   4-12-2023  11:29a  <DIR>     ..",
          "   6-10-2022   2:13p    329015  javacore20220610.141326.851.txt",
          "   4-13-2023  12:26a  <DIR>     logs",
          "   4-12-2023  11:29a  <DIR>     lib",
          "   8-26-2022   3:47p         0  datafile.dat",
          "   4-07-2023   4:43p      3285  rmaLogs.bat",
          "   6-17-2022   4:27p    331255  javacore20220617.162738.889.txt",
          "   1-11-2023   2:20p    124636  2.txt",
          "   1-11-2023   2:08p    123518  1.txt",
          "   4-12-2023  11:30a      3233  RMAInventory.xml",
          "   4-07-2022   1:18p  <DIR>     config",
          "   1-19-2023  10:57a    202243  output.txt",
          "   4-12-2023   4:25p      5593  rmastart.bat",
          "  12-21-2022   2:37p    371164  javacore20221221.143719.894.txt",
          "   4-13-2023   1:11p         0  extfile.txt",
          "   4-12-2022  11:21p      2640  rmacli.bat",
          "   4-07-2023   4:43p      6936  rmaLogs.py",
          "  12-06-2022   4:48p    361885  javacore20221206.164808.421.txt",
          "   4-12-2022  11:21p      1908  rmamaint.bat",
          "   4-12-2023   4:25p      5498  rmasvc.bat",
          "   6-14-2022   3:27p    330641  javacore20220614.152748.389.txt",
          "   4-12-2022  11:21p      3225  rmaCollect.bat",
          "   4-07-2022  11:42a  <DIR>     user",
          "   4-07-2023   4:43p  <DIR>     ot",
          "   4-11-2023   2:09p  <DIR>     pd",
          "   4-12-2023  11:29a  <DIR>     license",
          "   4-12-2022  11:21p      5382  rmastartfo.bat",
          "",
          "          28 Files   51047768 KB free"
        ]
      }
    ],
    "package": "dir test 1"
  },
  {
    "_id": "643716b9f531a9fdbc26aab8",
    "id": 506,
    "retailer_id": "T0USAVE",
    "config_id": 51,
    "apply_time": "2023/04/12 15:50:05",
    "storeName": "PAS QA Lab 4000",
    "agentName": "PAS QA Lab 4000-PG",
    "status": "Cancel",
    "steps": [
      {
        "type": "upload",
        "file": 4,
        "to_location": "f:/somefolder/",
        "filename": "acsv.csv",
        "status": "Initial",
        "output": []
      }
    ],
    "package": "upload-file-4-12-23-1533cst"
  },
  {
    "_id": "64307bb9361211b4c6c53c4e",
    "id": 503,
    "retailer_id": "T0USAVE",
    "config_id": 50,
    "apply_time": "2023/04/07 16:40:46",
    "storeName": "Elera Store",
    "agentName": "Elera Store-PG",
    "status": "Cancel",
    "steps": [
      {
        "type": "upload",
        "file": 3,
        "to_location": "f:\\",
        "filename": "pas.iso",
        "status": "Initial",
        "output": []
      },
      {
        "type": "shell",
        "cmd": "shell",
        "args": "isomount f:\\pas.iso",
        "status": "Initial",
        "output": []
      },
      {
        "type": "shell",
        "cmd": "shell",
        "args": "p:\\install.bat",
        "status": "Initial",
        "output": []
      },
      {
        "type": "shell",
        "cmd": "shell",
        "args": "isomount -u",
        "status": "Initial",
        "output": []
      },
      {
        "type": "apply",
        "command": "apply",
        "product": "GF",
        "controller_reload": "normal",
        "terminal_load": "true",
        "status": "Initial",
        "output": []
      }
    ],
    "package": "PAS Sky Package",
    "reason": "2023-04-07 22:45:01 Failed to send store: java.lang.NullPointerException"
  },
  {
    "_id": "64307bb9361211b4c6c53c4d",
    "id": 502,
    "retailer_id": "T0USAVE",
    "config_id": 50,
    "apply_time": "2023/04/07 16:40:46",
    "storeName": "PAS QA Lab 4000",
    "agentName": "PAS QA Lab 4000-PG",
    "status": "Success",
    "steps": [
      {
        "type": "upload",
        "file": 3,
        "to_location": "f:\\",
        "filename": "pas.iso",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "shell",
        "cmd": "shell",
        "args": "isomount f:\\pas.iso",
        "status": "Success",
        "output": [
          "",
          "f:\\pas.iso successfully mounted."
        ]
      },
      {
        "type": "shell",
        "cmd": "shell",
        "args": "p:\\install.bat",
        "status": "Success",
        "output": [
          "",
          "f>ECHO OFF",
          "\f.                                                                         .",
          ".       Welcome to the PAS Extensions Installation Package                .",
          ".                                                                         .",
          ".                        4677TDA, 7201TB1                                 .",
          ".                                                                         .",
          ".      Copyright (C) 2020 Toshiba Global Commerce Solutions, Inc.         .",
          ".                Licensed Material - All Rights Reserved                  .",
          ".                                                                         .",
          "Copying p:\\ASM\\adxcgtfd.dat ADX_IMNT:",
          "Copying p:\\ASM\\ADXCGTFU.DAT ADX_IMNT:",
          "Copying p:\\ASM\\ADXCGTFZ.DAT ADX_IMNT:",
          "Copying p:\\ASM\\cronmst.dat ADX_IMNT:",
          "Copying p:\\ASM\\rma_mqtt.cfg ADX_IMNT:",
          "Copying p:\\ASM\\rma4690u.zip ADX_IMNT:",
          "Copying p:\\ASM\\pasrma.zip ADX_IMNT:",
          "Copying p:\\ASM\\adxxtdjb.dat ADX_IMNT:",
          "Copying p:\\ASM\\applyfst.bat ADX_IMNT:",
          "Copying p:\\ASM\\formatln.bat ADX_IMNT:",
          "Copying p:\\ASM\\frmt_id.py ADX_IMNT:",
          "Copying p:\\ASM\\start_bg.py ADX_IMNT:",
          "Copying p:\\ASM\\pasrsrc.dat ADX_IMNT:",
          "Copying p:\\ASM\\pasuser.zip ADX_IMNT:",
          "Copying p:\\ASM\\otagent.zip ADX_IMNT:",
          "Copying p:\\ASM\\otcoll.zip ADX_IMNT:",
          "Copying p:\\ASM\\zip4j.jar ADX_IMNT:",
          "Copying p:\\ASM\\pythlib.zip ADX_IMNT:",
          "Copying p:\\ASM\\adxiwc0l.286 ADX_IMNT:",
          "Copying p:\\ASM\\chkfat.386 ADX_IMNT:",
          "Copying p:\\ASM\\md5.386 ADX_IMNT:",
          "Copying p:\\ASM\\pasagent.xml ADX_IMNT:",
          "Copying p:\\ASM\\rmasvc.bat ADX_IMNT:",
          "Copying p:\\ASM\\rmastart.bat ADX_IMNT:",
          "Copying p:\\ASM\\adxxtdj1.dat ADX_IMNT:",
          "Copying p:\\ASM\\pasext.jar ADX_IMNT:",
          "Copying p:\\ASM\\jackanno.jar ADX_IMNT:",
          "Copying p:\\ASM\\jackbind.jar ADX_IMNT:",
          "Copying p:\\ASM\\jackcore.jar ADX_IMNT:",
          "Copying p:\\ASM\\dockapi.jar ADX_IMNT:",
          "Copying p:\\ASM\\dockcore.jar ADX_IMNT:",
          "Copying p:\\ASM\\dockclt5.jar ADX_IMNT:",
          "Copying p:\\ASM\\docktran.jar ADX_IMNT:",
          "Copying p:\\ASM\\hamcrest.jar ADX_IMNT:",
          "Copying p:\\ASM\\httpclt5.jar ADX_IMNT:",
          "Copying p:\\ASM\\httpcr5.jar ADX_IMNT:",
          "Copying p:\\ASM\\jsonsimp.jar ADX_IMNT:",
          "Copying p:\\ASM\\comio.jar ADX_IMNT:",
          "Copying p:\\ASM\\guava.jar ADX_IMNT:",
          "Copying p:\\ASM\\comlang3.jar ADX_IMNT:",
          "Copying p:\\ASM\\comcomp.jar ADX_IMNT:",
          "Copying p:\\ASM\\slf4japi.jar ADX_IMNT:",
          "Copying p:\\ASM\\jna.jar ADX_IMNT:",
          "Copying p:\\ASM\\json.jar ADX_IMNT:",
          "Copying p:\\ASM\\jersybun.jar ADX_IMNT:",
          "Copying p:\\ASM\\mongodr.jar ADX_IMNT:",
          "Copying p:\\ASM\\snmp4j.jar ADX_IMNT:",
          "Copying p:\\ASM\\amqpclt.jar ADX_IMNT:",
          "Copying p:\\ASM\\rmalogs.bat ADX_IMNT:",
          "Copying p:\\ASM\\rmalogs.py ADX_IMNT:",
          "\f.            Installation of PAS Extensions                               .",
          ".                                                                         .",
          ".                            is now complete                              .",
          ".                                                                         .",
          ". The next step is to exit Command Mode and activate the maintenance      .",
          ". using Apply Software Maintenance.   The installation logs can be viewed .",
          ". at any time at C:\\adxcgtfd.log.                                               ."
        ]
      },
      {
        "type": "shell",
        "cmd": "shell",
        "args": "isomount -u",
        "status": "Success",
        "output": [
          "",
          "Un-mount successful."
        ]
      },
      {
        "type": "apply",
        "command": "apply",
        "product": "GF",
        "controller_reload": "normal",
        "terminal_load": "true",
        "status": "Success",
        "output": [
          "",
          "RUNNING  16:42:31 ADXCST0L Y 1GF  TL                                            ",
          "IPL.\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
          "SUCCESS  16:42:32 ADXCST0L Y 1GF  TL                                              ",
          "                                                                                ",
          "                                                                                ",
          "RUNNING  16:42:51 ADXILT0L adx_ipgm:ADXCGTFD.DAT T                                ",
          "SUCCESS  16:42:51 ADXILT0L adx_ipgm:ADXCGTFD.DAT T                                ",
          "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000"
        ]
      }
    ],
    "package": "PAS Sky Package"
  },
  {
    "_id": "63a35e5413b00afe835227dd",
    "id": 451,
    "retailer_id": "T0USAVE",
    "config_id": 46,
    "apply_time": "2022/12/21 14:47:00",
    "storeName": "4000 CFinley",
    "agentName": "4000 CFinley-PG",
    "status": "Success",
    "steps": [
      {
        "type": "upload",
        "file": 1,
        "to_location": "adx_imnt:",
        "filename": "sigui.zip",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "unzip",
        "file": "adx_imnt:sigui.zip",
        "directory": "adx_imnt:",
        "distribute": "5",
        "status": "Success",
        "output": [
          "adxnszzl - Version 3.7.2 - May  1 2020 12:53:17",
          "  tool code Copyright (c) 2003,2020 Toshiba Global Commerce Solutions Inc",
          "  zlib code Copyright (c) 1995-2002 Jean-loup Gailly and Mark Adler",
          "",
          "Archive: adx_imnt:sigui.zip",
          "Inflating : c:/ADX_IMNT/APSINSTA.LOG (2957 bytes)...Done",
          "Inflating : c:/ADX_IMNT/BCKNAMES.XML (6165 bytes)...Done",
          "Inflating : c:/ADX_IMNT/CFGUTIL.OUT (1106 bytes)...Done",
          "Inflating : c:/ADX_IMNT/DIF (1331 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z00 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z01 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z02 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z03 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z04 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z05 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z06 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z07 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z08 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z09 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z10 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z11 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z12 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z13 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z14 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z15 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z16 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.ZIP (869966 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMINSTA.LOG (38003 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMS$000.NEW (1488 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMS@000.NEW (8284 bytes)...Done",
          "Inflating : c:/ADX_IMNT/MIGEPS.BAT (8941 bytes)...Done",
          "Inflating : c:/ADX_IMNT/PCFCHECK.ACE (486 bytes)...Done",
          "Inflating : c:/ADX_IMNT/PCFCHECK.EPS (486 bytes)...Done",
          "Inflating : c:/ADX_IMNT/RMTACE.BAT (8483 bytes)...Done",
          "Inflating : c:/ADX_IMNT/RMTEPS.BAT (4070 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXCBTCD.DAT (221 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SISECURE.BAT (430 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIUTIL.JAR (210392 bytes)...Done",
          "Inflating : c:/ADX_IMNT/CMCOMPAT.JAR (41012 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXEBBCF.DAT (17 bytes)...Done",
          "Inflating : c:/ADX_IMNT/INSTALL.JAR (27171 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXXTDAT.DAT (7389461 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXXTDPT.DAT (11110435 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFACE.JAR (638918 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXEABUF.DAT (17 bytes)...Done",
          "Inflating : c:/ADX_IMNT/J.PRO (2200 bytes)...Done",
          "Inflating : c:/ADX_IMNT/POSPROV.JAR (385511 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEF.JAR (2204182 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFSYS.JAR (5937536 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFIO.JAR (1246675 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SILAUNCH.JAR (26894 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SICOMPAT.JAR (242675 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIJIOP.JAR (223594 bytes)...Done",
          "Inflating : c:/ADX_IMNT/CSS.JAR (99223 bytes)...Done",
          "Inflating : c:/ADX_IMNT/CSSJ6PAT.BAT (441 bytes)...Done",
          "Inflating : c:/ADX_IMNT/POSBC.JAR (382719 bytes)...Done",
          "Inflating : c:/ADX_IMNT/BC.JAR (182021 bytes)...Done",
          "Inflating : c:/ADX_IMNT/BC_API.JAR (2184377 bytes)...Done",
          "Inflating : c:/ADX_IMNT/PML.JAR (180013 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIDBG.PRO (4663 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFVIRT.TXT (629 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFVIRT.J6 (1395 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMINLOGS.PRO (3400 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMINLOGS.J6 (3424 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMIDLOGS.PRO (4077 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMIDLOGS.J6 (4177 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMAXLOGS.PRO (3283 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMAXLOGS.J6 (3398 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXCATUZ.DAT (1479 bytes)...Done",
          "Inflating : c:/ADX_IMNT/POSTSI_F.DAT (399 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIIBM.JAR (335 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIUSER.JAR (2425 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIBUSP.JAR (335 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SICOMP.JAR (335 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SISTORE.JAR (824 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFLOAD.PRO (3543 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXCATUD.DAT (1121 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVSA.JAR (539430 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXXTDGA.DAT (17278988 bytes)...Done",
          "Inflating : c:/ADX_IMNT/JCST1.PRO (1021 bytes)...Done",
          "Inflating : c:/ADX_IMNT/DD.PRO (2404 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVACE.JAR (224922 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXEBBBF.DAT (17 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SUREVIEW.JAR (4367726 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVRMI.JAR (50758 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLOG.PRO (3889 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLOGDBG.PRO (4108 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLOGMID.PRO (4488 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLG2.PRO (4014 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLG2DBG.PRO (4249 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLG2MID.PRO (4597 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SILVER.JAR (7375127 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVIBM.JAR (335 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVUSER.JAR (1229860 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVBUSP.JAR (16070 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVSTORE.JAR (335 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVCOMP.JAR (611799 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXCBTBD.DAT (671 bytes)...Done"
        ]
      },
      {
        "type": "apply",
        "command": "apply",
        "product": "AU BB BC",
        "controller_reload": "normal",
        "terminal_load": "true",
        "status": "Success",
        "output": [
          "",
          "RUNNING  14:47:46 ADXCST0L Y 1AU  1BB  1BC  TL                                  ",
          "IPL.\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
          "SUCCESS  14:47:47 ADXCST0L Y 1AU  1BB  1BC  TL                                    ",
          "                                                                                ",
          "                                                                                ",
          "RUNNING  14:48:06 ADXILT0L adx_ipgm:ADXCATUD.DAT T                                ",
          "RUNNING  14:48:07 ADXILT0L adx_ipgm:ADXCBTBD.DAT T                                ",
          "RUNNING  14:48:07 ADXILT0L adx_ipgm:ADXCBTCD.DAT T                                ",
          "SUCCESS  14:48:07 ADXILT0L adx_ipgm:ADXCATUD.DAT T                                ",
          "SUCCESS  14:48:07 ADXILT0L adx_ipgm:ADXCBTBD.DAT T                                ",
          "SUCCESS  14:48:07 ADXILT0L adx_ipgm:ADXCBTCD.DAT T                                ",
          "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000"
        ]
      }
    ],
    "package": "SWD3-TC01-SIGUI-V2"
  },
  {
    "_id": "63a35af913b00afe835227dc",
    "id": 450,
    "retailer_id": "T0USAVE",
    "config_id": 35,
    "apply_time": "2022/12/21 14:23:00",
    "storeName": "4000 CFinley",
    "agentName": "4000 CFinley-PG",
    "status": "Success",
    "steps": [
      {
        "type": "apply",
        "command": "backout",
        "product": "AU BB BC",
        "controller_reload": "normal",
        "terminal_load": "true",
        "status": "Success",
        "output": [
          "",
          "RUNNING  14:22:59 ADXCST0L Y 2AU  2BB  2BC  TL                                  ",
          "IPL.\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
          "SUCCESS  14:22:59 ADXCST0L Y 2AU  2BB  2BC  TL                                    ",
          "                                                                                ",
          "                                                                                ",
          "RUNNING  14:23:19 ADXILT0L adx_ipgm:ADXCATUD.DAT C                                ",
          "RUNNING  14:23:19 ADXILT0L adx_ipgm:ADXCBTBD.DAT C                                ",
          "RUNNING  14:23:19 ADXILT0L adx_ipgm:ADXCBTCD.DAT C                                ",
          "SUCCESS  14:23:19 ADXILT0L adx_ipgm:ADXCATUD.DAT C                                ",
          "SUCCESS  14:23:19 ADXILT0L adx_ipgm:ADXCBTBD.DAT C                                ",
          "SUCCESS  14:23:19 ADXILT0L adx_ipgm:ADXCBTCD.DAT C                                ",
          "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000"
        ]
      }
    ],
    "package": "SWD3-BackOffASM"
  },
  {
    "_id": "63a3550b13b00afe835227db",
    "id": 449,
    "retailer_id": "T0USAVE",
    "config_id": 47,
    "apply_time": "2022/12/21 14:10:01",
    "storeName": "4000 CFinley",
    "agentName": "4000 CFinley-PG",
    "status": "Success",
    "steps": [
      {
        "type": "upload",
        "file": 1,
        "to_location": "adx_imnt:",
        "filename": "sigui.zip",
        "status": "Success",
        "output": [
          "The file deployment is completed successfully"
        ]
      },
      {
        "type": "unzip",
        "file": "adx_imnt:sigui.zip",
        "directory": "adx_imnt:",
        "distribute": "5",
        "status": "Success",
        "output": [
          "adxnszzl - Version 3.7.2 - May  1 2020 12:53:17",
          "  tool code Copyright (c) 2003,2020 Toshiba Global Commerce Solutions Inc",
          "  zlib code Copyright (c) 1995-2002 Jean-loup Gailly and Mark Adler",
          "",
          "Archive: adx_imnt:sigui.zip",
          "Inflating : c:/ADX_IMNT/APSINSTA.LOG (2957 bytes)...Done",
          "Inflating : c:/ADX_IMNT/BCKNAMES.XML (6165 bytes)...Done",
          "Inflating : c:/ADX_IMNT/CFGUTIL.OUT (1106 bytes)...Done",
          "Inflating : c:/ADX_IMNT/DIF (1331 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z00 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z01 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z02 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z03 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z04 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z05 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z06 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z07 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z08 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z09 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z10 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z11 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z12 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z13 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z14 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z15 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.Z16 (2500000 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMACERM.ZIP (869966 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMINSTA.LOG (38003 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMS$000.NEW (1488 bytes)...Done",
          "Inflating : c:/ADX_IMNT/EAMS@000.NEW (8284 bytes)...Done",
          "Inflating : c:/ADX_IMNT/MIGEPS.BAT (8941 bytes)...Done",
          "Inflating : c:/ADX_IMNT/PCFCHECK.ACE (486 bytes)...Done",
          "Inflating : c:/ADX_IMNT/PCFCHECK.EPS (486 bytes)...Done",
          "Inflating : c:/ADX_IMNT/RMTACE.BAT (8483 bytes)...Done",
          "Inflating : c:/ADX_IMNT/RMTEPS.BAT (4070 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXCBTCD.DAT (221 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SISECURE.BAT (430 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIUTIL.JAR (210392 bytes)...Done",
          "Inflating : c:/ADX_IMNT/CMCOMPAT.JAR (41012 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXEBBCF.DAT (17 bytes)...Done",
          "Inflating : c:/ADX_IMNT/INSTALL.JAR (27171 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXXTDAT.DAT (7389461 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXXTDPT.DAT (11110435 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFACE.JAR (638918 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXEABUF.DAT (17 bytes)...Done",
          "Inflating : c:/ADX_IMNT/J.PRO (2200 bytes)...Done",
          "Inflating : c:/ADX_IMNT/POSPROV.JAR (385511 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEF.JAR (2204182 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFSYS.JAR (5937536 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFIO.JAR (1246675 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SILAUNCH.JAR (26894 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SICOMPAT.JAR (242675 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIJIOP.JAR (223594 bytes)...Done",
          "Inflating : c:/ADX_IMNT/CSS.JAR (99223 bytes)...Done",
          "Inflating : c:/ADX_IMNT/CSSJ6PAT.BAT (441 bytes)...Done",
          "Inflating : c:/ADX_IMNT/POSBC.JAR (382719 bytes)...Done",
          "Inflating : c:/ADX_IMNT/BC.JAR (182021 bytes)...Done",
          "Inflating : c:/ADX_IMNT/BC_API.JAR (2184377 bytes)...Done",
          "Inflating : c:/ADX_IMNT/PML.JAR (180013 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIDBG.PRO (4663 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFVIRT.TXT (629 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFVIRT.J6 (1395 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMINLOGS.PRO (3400 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMINLOGS.J6 (3424 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMIDLOGS.PRO (4077 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMIDLOGS.J6 (4177 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMAXLOGS.PRO (3283 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SMAXLOGS.J6 (3398 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXCATUZ.DAT (1479 bytes)...Done",
          "Inflating : c:/ADX_IMNT/POSTSI_F.DAT (399 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIIBM.JAR (335 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIUSER.JAR (2425 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SIBUSP.JAR (335 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SICOMP.JAR (335 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SISTORE.JAR (824 bytes)...Done",
          "Inflating : c:/ADX_IMNT/AEFLOAD.PRO (3543 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXCATUD.DAT (1121 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVSA.JAR (539430 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXXTDGA.DAT (17278988 bytes)...Done",
          "Inflating : c:/ADX_IMNT/JCST1.PRO (1021 bytes)...Done",
          "Inflating : c:/ADX_IMNT/DD.PRO (2404 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVACE.JAR (224922 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXEBBBF.DAT (17 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SUREVIEW.JAR (4367726 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVRMI.JAR (50758 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLOG.PRO (3889 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLOGDBG.PRO (4108 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLOGMID.PRO (4488 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLG2.PRO (4014 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLG2DBG.PRO (4249 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVLG2MID.PRO (4597 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SILVER.JAR (7375127 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVIBM.JAR (335 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVUSER.JAR (1229860 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVBUSP.JAR (16070 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVSTORE.JAR (335 bytes)...Done",
          "Inflating : c:/ADX_IMNT/SVCOMP.JAR (611799 bytes)...Done",
          "Inflating : c:/ADX_IMNT/ADXCBTBD.DAT (671 bytes)...Done"
        ]
      },
      {
        "type": "apply",
        "command": "apply",
        "product": "AU BB BC",
        "controller_reload": "normal",
        "terminal_load": "true",
        "status": "Success",
        "output": [
          "",
          "RUNNING  14:10:47 ADXCST0L Y 1AU  1BB  1BC  TL                                  ",
          "IPL.\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
          "SUCCESS  14:10:48 ADXCST0L Y 1AU  1BB  1BC  TL                                    ",
          "                                                                                ",
          "                                                                                ",
          "RUNNING  14:11:07 ADXILT0L adx_ipgm:ADXCATUD.DAT T                                ",
          "RUNNING  14:11:07 ADXILT0L adx_ipgm:ADXCBTBD.DAT T                                ",
          "RUNNING  14:11:08 ADXILT0L adx_ipgm:ADXCBTCD.DAT T                                ",
          "SUCCESS  14:11:08 ADXILT0L adx_ipgm:ADXCATUD.DAT T                                ",
          "SUCCESS  14:11:08 ADXILT0L adx_ipgm:ADXCBTBD.DAT T                                ",
          "SUCCESS  14:11:08 ADXILT0L adx_ipgm:ADXCBTCD.DAT T                                ",
          "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000"
        ]
      }
    ],
    "package": "CF_SWD3-TC4.1 !@#$%^&*() Special Characters"
  },
  {
    "_id": "63a33c9013b00afe835227d9",
    "id": 448,
    "retailer_id": "T0USAVE",
    "config_id": 46,
    "apply_time": "2022/12/21 12:15:00",
    "storeName": "4000 CFinley",
    "agentName": "4000 CFinley-PG",
    "status": "Failed",
    "steps": [
      {
        "type": "upload",
        "file": 1,
        "to_location": "adx_imnt:",
        "filename": "sigui.zip",
        "status": "Failed",
        "output": [
          "The file deployment has failed with an exception of: java.io.FileNotFoundException: \"f:\\rma\\user\\rma\\data\\softdist\\1.upload\", FLEXOSEXCEPTION (rc=0x805c4010) File not found"
        ]
      },
      {
        "type": "unzip",
        "file": "adx_imnt:sigui.zip",
        "directory": "adx_imnt:",
        "distribute": "5",
        "status": "Pending",
        "output": []
      },
      {
        "type": "apply",
        "command": "apply",
        "product": "AU BB BC",
        "controller_reload": "normal",
        "terminal_load": "true",
        "status": "Pending",
        "output": []
      }
    ],
    "package": "SWD3-TC01-SIGUI-V2"
  }
];
