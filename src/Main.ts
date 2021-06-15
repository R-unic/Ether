#!/usr/bin/env node
import { argv } from "process";
import { Ether } from "./Ether";

argv.splice(0, 2)
Ether.Main(argv);