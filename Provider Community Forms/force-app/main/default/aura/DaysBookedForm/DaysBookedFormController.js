({
    init: function (component, event, helper) {
        helper.getDomainHelper(component, event, helper);
    },

    generateInvoice: function (component, event, helper) {
        var sDate = component.get("v.startDate");
        var eDate = component.get("v.endDate");
        var record = component.get("v.recordId");
        var domain = component.get("v.domain");

        console.log("domain:");
        console.log(domain);

        component.set(
            "v.url",
            "https://" +
                domain +
                ".vf.force.com/apex/DaysBookedForm?id=" +
                record +
                "&endDate=" +
                eDate +
                "&startDate=" +
                sDate
        );
        component.set("v.showInvoice", true);
        component.set("v.generateInvoice", true);
    },

    backAction: function (component, event, helper) {
        component.set("v.showInvoice", false);
    },

    sendAttachmentController: function (component, event, helper) {
        console.log(component.get("v.recordId"));
        helper.sendAttachmentHelper(component);
    },

    savePdfController: function (component, event, helper) {
        //console.log(component.get('v.recordId'));
        helper.savePdfHelper(component);
    },

    dateChecker: function (component, event, helper) {
        console.log(component.get("v.startDate"));
        var sDate = new Date(component.get("v.startDate"));
        var eDate = new Date(component.get("v.endDate"));
        if (eDate >= sDate) {
            component.set("v.generateInvoice", false);
        }
    }
});