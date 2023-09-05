({
    getDomainHelper: function (component) {
        var action = component.get("c.getmydomain");
        action.setParams({});
        action.setCallback(this, function (a) {
            console.log(a);
            var state = a.getState();
            if (state == "SUCCESS") {
                console.log(a.getReturnValue());
                component.set("v.domain", a.getReturnValue());

                var obj = component.get("v.sObjectName");
                component.set(
                    "v.url",
                    "https://" +
                        a.getReturnValue() +
                        "--c.visualforce.com/apex/DaysBookedForm?object=" +
                        obj +
                        "&combineId="
                );
            }
        });
        $A.enqueueAction(action);
    },

    sendAttachmentHelper: function (component) {
        console.log(component);
        var action = component.get("c.sendAttachment");
        action.setParams({
            recordId: component.get("v.recordId"),
            invoiceSent: false,
            startDate: component.get("v.startDate"),
            endDate: component.get("v.endDate"),
            pdfUrl: component.get("v.url")
        });
        action.setCallback(this, function (a) {
            var state = a.getState();
            if (state == "SUCCESS") {
                console.log(a.getReturnValue());
                if (a.getReturnValue()) {
                    alert("Email Sent Successfully");
                    window.location.reload();
                } else {
                    alert("Email Failed Contact Salesforce Administrator");
                }
            } else {
                alert("Email Failed Contact Salesforce Administrator");
            }
        });
        $A.enqueueAction(action);
    },

    savePdfHelper: function (component) {
        var action = component.get("c.savePdf");
        action.setParams({
            recordId: component.get("v.recordId"),
            invoiceSent: false,
            startDate: component.get("v.startDate"),
            endDate: component.get("v.endDate"),
            pdfUrl: component.get("v.url")
        });
        action.setCallback(this, function (a) {
            var state = a.getState();
            if (state == "SUCCESS") {
                alert("Invoice Saved Successfully");
                window.location.reload();
            } else {
                alert("Invoice Saved Failed");
            }
        });
        $A.enqueueAction(action);
    }
});