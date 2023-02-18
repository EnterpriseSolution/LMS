import Services from "./services";
import ViewModels from "./myVM";
import { utils, eworkspace } from "./global";

export class CustomWidget {
    constructor(config) {
        this.profile = profile == null ? config.userProfile : profile;
        this.ServiceDomain = config.serviceUrl != null && config.serviceUrl.length > 0 ? config.serviceUrl : (location.protocol + '//' + location.host + '/yokogawa.TLSVP.Core.WebAPIs/api');
        this.viewModelPrefix = config.viewModelName + ".";
    }
    exportViewModel() {

        return ViewModels;
    }
    exportServices() {
        return Services;
    }
    setCore(core) {
        eworkspace = core;
        utils = core.utils;
    }
}