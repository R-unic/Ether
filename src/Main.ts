import { argv } from "process";
import { Ether } from "./Ether";

argv.splice(0, 2);
(async () => await Ether.Main(argv))();
