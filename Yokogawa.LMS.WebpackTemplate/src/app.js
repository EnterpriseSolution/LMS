import Services from "./services/VesselOperation/services";
import ViewModels from "./viewmodels/VesselOperation/viewmodels";
import { importTangramCore, importAppConfig} from "./global";

export class VesselOrder {
    constructor(config) {
        /*widget configuration defined in platform
         * { 
         *   viewModelName - viewmodel namespace defined in platform
         *   profile  - login user profile
         *   serviceUrl - widget REST API service Url
         *   TemplateFileFolder - HTML template folder in platform
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