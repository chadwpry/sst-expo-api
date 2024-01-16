import * as outputsJSON from '../../../.sst/outputs.json';
import * as easJSON from '../eas.example.json';

const eas = easJSON.default;
const outputs = outputsJSON.default;

const stage = "development";

for (const [key, value] of Object.entries(outputs)) {
  eas.build[stage].env = {
    ...eas.build[stage].env,
    ...value,
  };
}

const onWrite = async () => {
  Bun.write("./eas.json", JSON.stringify(eas, null, 4));
}

onWrite();
