import Services from "./services/MasterData/services";
import ViewModels from "./viewmodels/MasteData/viewmodels";
import { importTangramCore, importAppConfig} from "./global";

export class MasterData {
    constructor(config) {
        /*widget configuration defined in platform
         * { 
         *   viewModelName - viewmodel namespace defined in platform
         *   profile  - login user profile
         *   serviceUrl - widget REST API service Url
         *   pathname  - application pathname for react project navigation
         * }
         */
        importAppConfig(config);
    }
    exportViewModel() {
        return ViewModels;
    }
    exportServices() {
        return Services;
    }
    setCore(core) {
        importTangramCore(core)
    }
}