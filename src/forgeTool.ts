import { Curseforge } from "node-curseforge";

const cf_token = "$2a$10$0ER7wvAj2Z5eY494Irr8NOA/1oidSUEv6MTbws8prR5rhG70A/yZG";

let cf = new Curseforge(cf_token);

export const findByQuery = async (
  query: string,
  num?: number,
  fileNum?: number
): Promise<any> => {
  let mc = await cf.get_game("minecraft");
  const mods = await mc.search_mods({ searchFilter: query });

  if (!num && !fileNum) {
    return mods.map((mod, index) => `[${index + 1}] ${mod.name}`);
  } else if (num && !fileNum) {
    const selectedMod = mods[num];
    const filesList = selectedMod.latestFiles;
    return filesList.map((file, index) => `[${index + 1}] ${file.displayName} ${file.isServerPack || file.serverPackFileId ? '- server' : ''}`);
  } else if (num && fileNum) {
    const selectedVersion = mods[num].latestFiles[fileNum];
    const serverFile = await cf.get_file(
      mods[num],
      selectedVersion.serverPackFileId!
    );

    const downloadUrl = serverFile.downloadUrl;
    return { url: downloadUrl };
  }
};
