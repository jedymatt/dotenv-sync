import { Command } from "commander";
import axios from "axios";
import { z } from "zod";
import fs from "fs";
import path from "path";
import os from "os";

const SERVER_BASE_URL = "http://localhost:3000/api";

export function makeAuthCommand() {
  const auth = new Command("auth");

  auth
    .command("login")
    .description("login to the server")
    .action(async () => {
      console.log("logging in");

      const response = await axios.post(`${SERVER_BASE_URL}/device/code`);

      if (response.status !== 200) {
        console.error("failed to get device code");
        return;
      }

      const { deviceCode, userCode } = z
        .object({
          deviceCode: z.string(),
          userCode: z.string(),
        })
        .parse(response.data);

      console.log("user code:", userCode);
      console.log(
        "go to http://localhost:3000/device/verify and enter the code",
      );

      let statusReponse = await axios.get(`${SERVER_BASE_URL}/device/status`, {
        params: {
          device_code: deviceCode,
        },
      });

      const StatusSchema = z.object({
        authorized: z.boolean(),
      });

      let authorized = false;

      while (!authorized) {
        const status = StatusSchema.parse(statusReponse.data);
        authorized = status.authorized;
        await new Promise((resolve) => setTimeout(resolve, 5000));

        if (authorized) {
          break;
        }

        statusReponse = await axios.get(`${SERVER_BASE_URL}/device/status`, {
          params: {
            device_code: deviceCode,
          },
        });
      }

      // authorized

      // save the device code to the local storage
      // create .dotenvsyncrc file in home directory
      fs.writeFileSync(path.join(os.homedir(), ".dotenvsyncrc"), deviceCode);
      console.log("logged in");
    });

  auth
    .command("logout")
    .description("logout from the server")
    .action(() => {
      console.log("logging out");
    });

  auth
    .command("whoami")
    .description("get the current logged in user")
    .action(() => {
      console.log("you are logged in as: user");
    });

  return auth;
}
