#!/usr/bin/env node

import inquirer from "inquirer";
import { findByQuery } from "./forgeTool.js";
import chalk from "chalk";
import { exec } from "child_process";

const initQuestion = [
  {
    type: "input",
    name: "modName",
    message: "Type the mod name:",
  },
];

export const initCLI = async () => {
  const { modName } = await inquirer.prompt(initQuestion);
  try {
    if (modName) {
      const modsList = await findByQuery(modName);

      if (modsList.length === 0) {
        console.warn(chalk.yellow("No mods with this name found, try again"));
        initCLI();
        return;
      }

      addReturnOption(modsList);

      const { selectedMod } = await inquirer.prompt({
        type: "list",
        name: "selectedMod",
        message: "Select the mod from the list:",
        choices: modsList.map((el: string, index: number) => {
          return {
            name: el,
            value: index,
          };
        }),
      });

      if (selectedMod == modsList.length - 1) {
        initCLI();
        return;
      }

      const filesList = await findByQuery(modName, selectedMod);
      addReturnOption(filesList);

      const { file } = await inquirer.prompt({
        type: "list",
        name: "file",
        message: "Select the file from the list:",
        choices: filesList.map((el: string, index: number) => {
          return {
            name: el,
            value: index,
          };
        }),
      });

      if (file == filesList.length - 1) {
        initCLI();
        return;
      }

      const { url } = await findByQuery(modName, selectedMod, file);

      const { download } = await inquirer.prompt({
        type: "confirm",
        name: "download",
        message: "Do you want to download it?",
        default: true,
      });

      console.log(`download url: ${chalk.green(url)}`);

      download && getByLink(url);
    }
  } catch (error) {
    console.log(error);
  }
};

const addReturnOption = (array: Array<string>) => {
  array.push(chalk.yellow("Try Another Search"));
};

const getByLink = (link) => {
  exec(`wget ${link}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};
