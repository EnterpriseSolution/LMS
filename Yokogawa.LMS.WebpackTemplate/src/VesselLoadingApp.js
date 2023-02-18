import Services from "./services/VesselLoadingOrder/Service";
import ViewModels from "./viewmodels/VesselLoadingOrder/VesselLoadingOrderViewModel";
import { importTangramCore, importAppConfig } from "./global";

export class VesselLoading {
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