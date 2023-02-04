"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const Ether_1 = require("./Ether");
process_1.argv.splice(0, 2);
(async () => await Ether_1.Ether.Main(process_1.argv))();
