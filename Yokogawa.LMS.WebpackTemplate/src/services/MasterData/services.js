import { getJettyList, saveJetty, deleteJetty, getJettyDetails } from "./JettyService";
import { getAgentList, getAgentDetails, saveAgent, deleteAgent} from "./AgentService";
import { getCarrierList, getCarrierDetails, saveCarrier, deleteCarrier } from "./CarrierService";
import { getCompartmentList, getCompartmentDetails, saveCompartment, deleteCompartment } from "./CompartmentService";
import { getDriverList, getDriverDetails, saveDriver, deleteDriver } from "./DriverService";
import { getProductList, getProductDetails, saveProduct, deleteProduct } from "./ProductService";
import { getRFIDCardList, getRFIDCardDetails, saveRFIDCard, deleteRFIDCard } from "./RFIDCardService";
import { getTankList, getTankDetails, saveTank, deleteTank } from "./TankService";
import { getTruckList, getTruckDetails, saveTruck, deleteTruck } from "./TruckService";
import { getVesselList, getVesselDetails, saveVessel, deleteVessel } from "./VesselService";

export default function () {

    
    return {
        
        getJettyList, saveJetty, deleteJetty, getJettyDetails,
        getAgentList, getAgentDetails, saveAgent, deleteAgent,
        getCarrierList, getCarrierDetails, saveCarrier, deleteCarrier,
        getCompartmentList, getCompartmentDetails, saveCompartment, deleteCompartment,
        getDriverList, getDriverDetails, saveDriver, deleteDriver,
        getProductList, getProductDetails, saveProduct, deleteProduct,
        getRFIDCardList, getRFIDCardDetails, saveRFIDCard, deleteRFIDCard,
        getTankList, getTankDetails, saveTank, deleteTank,
        getTruckList, getTruckDetails, saveTruck, deleteTruck,
        getVesselList, getVesselDetails, saveVessel, deleteVessel
    };
};

  