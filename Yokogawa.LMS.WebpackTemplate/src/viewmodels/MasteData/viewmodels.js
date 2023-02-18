import {JettyList, JettyForm, JettyEditDialog} from "./JettyVM";
import {AgentList, AgentForm, AgentEditDialog} from "./AgentVM";
import {CarrierList, CarrierForm, CarrierEditDialog} from "./CarrierVM";
import {CompartmentList, CompartmentForm, CompartmentEditDialog} from "./CompartmentVM";
import {CustomerList, CustomerForm, CustomerEditDialog} from "./CustomerVM";
import {DriverList, DriverForm, DriverEditDialog} from "./DriverVM";
import {ProductList, ProductForm, ProductEditDialog} from "./ProductVM";
import { RFIDCardList, RFIDCardForm, RFIDCardEditDialog } from  "./RFIDCardVM";
import { TankList, TankForm, TankEditDialog } from "./TankVM";
import { TruckList, TruckForm, TruckEditDialog, TCompartmentForm, CompartmentDialog} from "./TruckVM";
import { VesselList, VesselForm, VesselEditDialog } from "./VesselVM";

export default function () {
    return {
        JettyList, JettyForm, JettyEditDialog,
        AgentList, AgentForm, AgentEditDialog,
        CarrierList, CarrierForm, CarrierEditDialog,
        CompartmentList, CompartmentForm, CompartmentEditDialog ,
        CustomerList, CustomerForm, CustomerEditDialog,
        DriverList, DriverForm, DriverEditDialog,
        ProductList, ProductForm, ProductEditDialog,
        RFIDCardList, RFIDCardForm, RFIDCardEditDialog,
        TankList, TankForm, TankEditDialog,
        TruckList, TruckForm, TruckEditDialog, TCompartmentForm, CompartmentDialog ,
        VesselList, VesselForm, VesselEditDialog
    };
}

