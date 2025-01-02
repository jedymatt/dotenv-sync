#! /usr/bin/env node

import { Command } from "commander";
import { makeAuthCommand } from "./auth";

const program = new Command();

program.version("1.0.0");

program
  .command("pull")
  .description("pulls the latest env file from the server")
  .action(() => {
    console.log("pulling the latest env file from the server");
  });

program.addCommand(makeAuthCommand());

program.parse();
