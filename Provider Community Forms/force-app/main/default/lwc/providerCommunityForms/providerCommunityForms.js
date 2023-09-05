import { LightningElement, wire, track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import getLoggedInUserContactId from '@salesforce/apex/FormController.getLoggedInUserContactId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// Import the schema for the fields you want to retrieve
import RELEASE_AND_AUTHORIZATION from '@salesforce/schema/Contact.Release_and_Authorization__c';
import PROF_LIAB_SUPP_CLAIMS_MULTI_FORM from '@salesforce/schema/Contact.Prof_Liab_Supp_Claims_Multi_Form__c';
import PROVIDER_SERVICES_AGREEMENT from '@salesforce/schema/Contact.Provider_Services_Agreement__c';
import COVID_INTERNAL_CLINICAL_SCREENING_ASSESS from '@salesforce/schema/Contact.COVID_Internal_Clinical_Screening_Assess__c';
import CORONAVIRUS_SCREENING_FORM from '@salesforce/schema/Contact.Coronavirus_Screening_Form__c';
import DIRECT_DEPOSIT_FORM from '@salesforce/schema/Contact.Direct_Deposit_Form__c';

import redirectToVisualforcePage from '@salesforce/apex/FormController.redirectToVisualforcePage';

export default class ProviderCommunityForm extends LightningElement {
    @track contactId;

    @track contactRecord;

    @track ReleaseAndAuthorization;
    @track ProfLiabSuppClaimsMultiForm;
    @track ProviderServicesAgreement;
    @track CovidInternalClinicalScreeningAssess;
    @track CoronavirusScreeningForm;
    @track DirectDepositForm;

    @track showReleaseAndAuthorizationForm;
    @track showProfLiabSuppClaimsMultiForm;
    @track showProviderServicesAgreementForm;
    @track showCOVIDInternalClinicalScreeningAssessmentForm;
    @track showCoronavirusScreeningForm;
    @track showDirectDepositForm;

    @track RAAFirstName;
    @track RAALastName;
    @track RAAMiddleName;
    @track RAAPreviousSurname;
    @track RAASuffix;
    @track RAAPrintName;
    @track RAASignature;
    @track RAADate = this.getCurrentDate();

    @track PLSCFirstName;
    @track PLSCLastName;
    @track PLSCTodaysDate = this.getCurrentDate();
    @track PLSCYesOrNa;
    @track PLSCHowMany;
    @track PLSCiAcknowledge;
    @track PLSCAppDefName;
    @track PLSCClaimPlaintName;
    @track PLSCDateError = this.getCurrentDate();
    @track PLSCDateClaim = this.getCurrentDate();
    @track PLSCIndicateWhetherA;
    @track PLSCNameInsuAndPolicy;
    @track PLSCAgentsName;
    @track PLSCTelephoneNumber;
    @track PLSCLocation;
    @track PLSCCaseNumber;
    @track PLSCDefLegRepName;
    @track PLSCTelephoneNumber2;
    @track PLSCAddress;
    @track PLSCCity;
    @track PLSCState;
    @track PLSCZipCode;
    @track PLSCPlainLegRepName;
    @track PLSCTelephoneNumber3;
    @track PLSCAddress2;
    @track PLSCCity2;
    @track PLSCState2;
    @track PLSCZipCode2;
    @track PLSCCourtJudgement;
    @track PLSCJudgementFor;
    @track PLSCBy;
    @track PLSCDate = this.getCurrentDate();
    @track PLSCOutCourtSettle;
    @track PLSCDateSettle = this.getCurrentDate();
    @track PLSCAmountPaidDefBehalf;
    @track PLSCCompensation;
    @track PLSCPunitDamagAwarded;
    @track PLSCTotalCompensation;
    @track PLSCClaimCaseDismised;
    @track PLSCAgainstDefendant;
    @track PLSCAgainstAllDefendants;
    @track PLSCDate2 = this.getCurrentDate();
    @track PLSCDescription;
    @track PLSCProviderInitials;

    @track PSAEffectiveDate = this.getCurrentDate();
    @track PSAContractor;
    @track PSAContractorInitials;
    @track PSAContractorSignature;
    @track PSADate = this.getCurrentDate();
    @track PSAPrintedName;
    @track PSAFederalTaxIdOrSecNumber;
    @track PSAIntegritySignature;
    @track PSADate2 = this.getCurrentDate();
    @track PSAPrintedNameTitle;

    @track CICSAProviderName;
    @track CICSADateInterview = this.getCurrentDate();
    @track CICSALocations;
    @track CICSACurrentSymptoms;
    @track CICSAProviderAroundCorona;
    @track CICSAIfYes1;
    @track CICSAIfYes2;
    @track CICSAIfYes3;
    @track CICSAIfYes4;
    @track CICSAIfYes5;
    @track CICSARiskCategory;
    @track CICSAWorkRestrictions;
    @track CICSANameOfCredentialer;
    @track CICSAElegDate = this.getCurrentDate();

    @track CSFLastName;
    @track CSFFirstName;
    @track CSFMobileNumber;
    @track CSFEmailAddress;
    @track CSFTraveledInter;
    @track CSFFever;
    @track CSFShortnessOfBreath;
    @track CSFCough;
    @track CSFContactWithCovid;
    @track CSFFirstAndLastName;

    @track DDFSelectOne;
    @track DDFNameBank;
    @track DDFTransitNum;
    @track DDFAccount;
    @track DDFPayeeName;
    @track DDFSignature;
    @track DDFDate = this.getCurrentDate();
    @track DDFSocialSecNum;
    @track DDFEmailAdd;

    @track comboboxFieldsFilled = true;
    @track isSubmitting = false;

    @track yesNoOpts = [
        {label: 'Yes', value: 'yes'},
        {label: 'NA', value: 'no'},
    ];
    @track judgementType = [
        {label: 'Suit', value: 'suit'},
        {label: 'Claim', value: 'claim'},
        {label: 'Incident Reported', value: 'increp'},
    ]
    @track judgementFor = [
        {label: 'Defendant', value: 'def'},
        {label: 'Plaintiff', value: 'plain'},
    ]
    @track by = [
        {label: 'Judge', value: 'judge'},
        {label: 'Jury', value: 'jury'},
    ]
    @track yesNoOpts2 = [
        {label: 'Yes', value: 'yes'},
        {label: 'No', value: 'no'},
    ];
    @track travelerRisks = [
        {label: 'High Risk', value: 'hi'},
        {label: 'Medium Risk', value: 'mid'},
        {label: 'Low Risk', value: 'low'},
        {label: 'No identifiable risk ', value: 'no'},
    ];
    @track recomRestrictions = [
        {label: 'None', value: 'none'},
        {label: 'Exclude from work for 14 days (post-exposure)', value: 'exc'},
    ];
    @track selectOne = [
        {label: 'Set up Direct Deposit', value: 'SDD'},
        {label: 'Cancel Direct Deposit', value: 'CDD'},
        {label: 'Checking Account', value: 'CA'},
        {label: 'Savings Account ', value: 'SA'},
    ];
    
    @track showDateInput = false;
    @track showHowManyInput = false;
    @track showCOVIDIfYes = false;

    @track fieldsCompleted = true;

    @track progressBarValue = 0;
    @track progressBarValueRounded = 0;

    renderedCallback() {
        try {
            let element = this.template.querySelector('span[data-my-id=fillProgressBarColor]');
            element.style.width = this.progressBarValue + '%';
            // if (this.progressBarValue == 100) {
            //     console.log(this.progressBarValue);
            //     element.style.backgroundColor = '#2E844A';
            // }
            console.log('here the width ' + element.style.width);
            console.log('hello');
        } catch (error) {
            console.log(error.message);
        }
    }

    // Retrieve the Contact Id using the Apex method
    @wire(getLoggedInUserContactId)
    wiredContactId({ error, data }) {
        if (data) {
            this.contactId = data;
        } else if (error) {
            console.error(error);
        }
    }

    // Retrieve the Contact record using the Contact Id and specified fields
    @wire(getRecord, { recordId: '$contactId', fields: [
        RELEASE_AND_AUTHORIZATION,
        PROF_LIAB_SUPP_CLAIMS_MULTI_FORM,
        PROVIDER_SERVICES_AGREEMENT,
        COVID_INTERNAL_CLINICAL_SCREENING_ASSESS,
        CORONAVIRUS_SCREENING_FORM,
        DIRECT_DEPOSIT_FORM
    ]})
    wiredContactRecord({ error, data }) {
        if (data) {
            this.contactRecord = data;

            this.setReleaseAndAuthorization(data.fields.Release_and_Authorization__c.value);
            this.setProfLiabSuppClaimsMultiForm(data.fields.Prof_Liab_Supp_Claims_Multi_Form__c.value);
            this.setProviderServicesAgreement(data.fields.Provider_Services_Agreement__c.value);
            this.setCovidInternalClinicalScreeningAssess(data.fields.COVID_Internal_Clinical_Screening_Assess__c.value);
            this.setCoronavirusScreeningForm(data.fields.Coronavirus_Screening_Form__c.value);
            this.setDirectDepositForm(data.fields.Direct_Deposit_Form__c.value);
        
            console.log(this.progressBarValue);        
        
            let arr = [this.ReleaseAndAuthorization, this.ProfLiabSuppClaimsMultiForm, this.ProviderServicesAgreement, this.CovidInternalClinicalScreeningAssess, this.CoronavirusScreeningForm, this.DirectDepositForm]
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == true) {
                    this.progressBarValue += (100/6)
                }
            }


            this.progressBarValueRounded = Math.round(this.progressBarValue);

            
        } else if (error) {
            console.error(error.message);
        }
    }

    setReleaseAndAuthorization(value) {
        this.ReleaseAndAuthorization = value;
    }

    setProfLiabSuppClaimsMultiForm(value) {
        this.ProfLiabSuppClaimsMultiForm = value;
    }

    setProviderServicesAgreement(value) {
        this.ProviderServicesAgreement = value;
    }

    setCovidInternalClinicalScreeningAssess(value) {
        this.CovidInternalClinicalScreeningAssess = value;
    }

    setCoronavirusScreeningForm(value) {
        this.CoronavirusScreeningForm = value;
    }
    
    setDirectDepositForm(value) {
        this.DirectDepositForm = value;
    }

    // ----------------

    handleReleaseAndAuthorizationOpen() {
        this.showReleaseAndAuthorizationForm = true;
    }
 
    handleReleaseAndAuthorizationClose() {
        this.showReleaseAndAuthorizationForm = false;
    }

    handleRAALastNameChange(event) {
        this.RAALastName = event.target.value;
    }
    
    handleRAAFirstNameChange(event) {
        this.RAAFirstName = event.target.value;
    }

    handleRAAMiddleNameChange(event) {
        this.RAAMiddleName = event.target.value;
    }

    handleRAAPreviousSurnameChange(event) {
        this.RAAPreviousSurname = event.target.value;
    }

    handleRAASuffixChange(event) {
        this.RAASuffix = event.target.value;
    }

    handleRAAPrintNameChange(event) {
        this.RAAPrintName = event.target.value;
    }

    handleRAASignatureChange(event) {
        this.RAASignature = event.target.value;
    }

    handleRAADateChange(event) {
        this.RAADate = event.target.value;
    }

    async handleReleaseAndAuthorizationSubmit(event) {
        event.preventDefault();

        if (this.isSubmitting) {
            return
        }

        this.isSubmitting = true;

        if (this.RAADate == null) {
            this.comboboxFieldsFilled = false;
            console.log('combobox field ' + this.comboboxFieldsFilled);
        }

        if (this.comboboxFieldsFilled == true) {
            try {
                console.log('hello');
                // Call the Apex method to redirect to the Visualforce page
    
                let input = {
                        lastname: this.RAALastName,
                        firstname: this.RAAFirstName,
                        middlename: this.RAAMiddleName,
                        previoussurname: this.RAAPreviousSurname,
                        suffix: this.RAASuffix,
                        printname: this.RAAPrintName,
                        signature: this.RAASignature,
                        date: this.RAADate,
                        contactId: this.contactId,
                }
                
                console.log('input ' + input.contactId);
    
                
                const url = await redirectToVisualforcePage({ inputValue: input, pageName: "ReleaseAndAuthorization" });

                // Redirect the user to the Visualforce page
                console.log('url ' + url);
                window.open(url, '_blank');
                location.reload();
            } catch (error) {
                // Handle error if needed
                console.error(error);
            } finally {
                this.isSubmitting = false;
            }
        } else {
            this.showToast();
            this.comboboxFieldsFilled = true;
            this.isSubmitting = false;
        }
    }

    // ----------------



    // ----------------

    handleProfLiabSuppClaimsMultiFormOpen() {
        this.showProfLiabSuppClaimsMultiForm = true;
        console.log('prof ', this.showProfLiabSuppClaimsMultiForm);
    }
 
    handleProfLiabSuppClaimsMultiFormClose() {
        this.showProfLiabSuppClaimsMultiForm = false;
    }

    handlePLSCFirstNameChange(event) {
        this.PLSCFirstName = event.target.value;
    }

    handlePLSCLastNameChange(event) {
        this.PLSCLastName = event.target.value;
    }

    handlePLSCTodaysDateChange(event) {
        this.PLSCTodaysDate = event.target.value;
    }

    handlePLSCYesOrNaChange(event) {
        this.PLSCYesOrNa = event.target.value;
        if (this.PLSCYesOrNa == 'yes') {
            this.showHowManyInput = true;
        } else {
            this.showHowManyInput = false;
        }
    }

    handlePLSCHowManyChange(event) {
        this.PLSCHowMany = event.target.value;
    }

    handlePLSCiAcknowledgeChange(event) {
        this.PLSCiAcknowledge = event.target.checked;
    }

    handlePLSCAppDefNameChange(event) {
        this.PLSCAppDefName = event.target.value;
    }

    handlePLSCClaimPlaintNameChange(event) {
        this.PLSCClaimPlaintName = event.target.value;
    }

    handlePLSCDateErrorChange(event) {
        this.PLSCDateError = event.target.value;
    }

    handlePLSCDateClaimChange(event) {
        this.PLSCDateClaim = event.target.value;
    }

    handlePLSCIndicateWhetherAChange(event) {
        this.PLSCIndicateWhetherA = event.target.value;
    }

    handlePLSCNameInsuAndPolicyChange(event) {
        this.PLSCNameInsuAndPolicy = event.target.value;
    }

    handlePLSCAgentsNameChange(event) {
        this.PLSCAgentsName = event.target.value;
    }

    handlePLSCTelephoneNumberChange(event) {
        this.PLSCTelephoneNumber = event.target.value;
    }

    handlePLSCLocationChange(event) {
        this.PLSCLocation = event.target.value;
    }

    handlePLSCCaseNumberChange(event) {
        this.PLSCCaseNumber = event.target.value;
    }

    handlePLSCDefLegRepNameChange(event) {
        this.PLSCDefLegRepName = event.target.value;
    }

    handlePLSCTelephoneNumber2Change(event) {
        this.PLSCTelephoneNumber2 = event.target.value;
    }

    handlePLSCAddressChange(event) {
        this.PLSCAddress = event.target.value;
    }

    handlePLSCCityChange(event) {
        this.PLSCCity = event.target.value;
    }

    handlePLSCStateChange(event) {
        this.PLSCState = event.target.value;
    }

    handlePLSCZipCodeChange(event) {
        this.PLSCZipCode = event.target.value;
    }

    handlePLSCPlainLegRepNameChange(event) {
        this.PLSCPlainLegRepName = event.target.value;
    }

    handlePLSCTelephoneNumber3Change(event) {
        this.PLSCTelephoneNumber3 = event.target.value;
    }

    handlePLSCAddress2Change(event) {
        this.PLSCAddress2 = event.target.value;
    }

    handlePLSCCity2Change(event) {
        this.PLSCCity2 = event.target.value;
    }

    handlePLSCState2Change(event) {
        this.PLSCState2 = event.target.value;
    }

    handlePLSCZipCode2Change(event) {
        this.PLSCZipCode2 = event.target.value;
    }

    handlePLSCCourtJudgementChange(event) {
        this.PLSCCourtJudgement = event.target.checked;
    }

    handlePLSCJudgementForChange(event) {
        this.PLSCJudgementFor = event.target.value;
    }

    handlePLSCByChange(event) {
        this.PLSCBy = event.target.value;
    }

    handlePLSCDateChange(event) {
        this.PLSCDate = event.target.value;
    }

    handlePLSCOutCourtSettleChange(event) {
        this.PLSCOutCourtSettle = event.target.checked;
    }

    handlePLSCDateSettleChange(event) {
        this.PLSCDateSettle = event.target.value;
    }

    handlePLSCAmountPaidDefBehalfChange(event) {
        this.PLSCAmountPaidDefBehalf = event.target.value;
    }

    handlePLSCCompensationChange(event) {
        this.PLSCCompensation = event.target.value;
    }

    handlePLSCPunitDamagAwardedChange(event) {
        this.PLSCPunitDamagAwarded = event.target.value;
    }

    handlePLSCTotalCompensationChange(event) {
        this.PLSCTotalCompensation = event.target.value;
    }

    handlePLSCClaimCaseDismisedChange(event) {
        this.PLSCClaimCaseDismised = event.target.checked;
    }

    handlePLSCAgainstDefendantChange(event) {
        this.PLSCAgainstDefendant = event.target.checked;
    }

    handlePLSCAgainstAllDefendantsChange(event) {
        this.PLSCAgainstAllDefendants = event.target.checked;
    }

    handlePLSCDate2Change(event) {
        this.PLSCDate2 = event.target.value;
    }

    handlePLSCDescriptionChange(event) {
        this.PLSCDescription = event.target.value;
    }

    handlePLSCProviderInitialsChange(event) {
        this.PLSCProviderInitials = event.target.value;
    }

    async handleProfLiabSuppClaimsMultiFormSubmit(event) {
        event.preventDefault();

        if (this.isSubmitting) {
            return
        }

        this.isSubmitting = true;

        if (this.PLSCYesOrNa == null || this.PLSCIndicateWhetherA == null || this.PLSCJudgementFor == null || this.PLSCBy == null || this.PLSCTodaysDate == null || this.PLSCDateError == null || this.PLSCDateClaim == null || this.PLSCDate == null || this.PLSCDate2 == null) {
            this.comboboxFieldsFilled = false;
            console.log('combobox field ' + this.comboboxFieldsFilled);
        }


        if (this.comboboxFieldsFilled == true) {
            try {
                console.log('hello');
                // Call the Apex method to redirect to the Visualforce page
    
                let input = {
                    firstname: this.PLSCFirstName,
                    lastname: this.PLSCLastName,
                    todaysdate: this.PLSCTodaysDate,
                    yesorna: this.PLSCYesOrNa,
                    howmany: this.PLSCHowMany,
                    iacknowledge: this.PLSCiAcknowledge,
                    appdefname: this.PLSCAppDefName,
                    claimplaintname: this.PLSCClaimPlaintName,
                    dateerror: this.PLSCDateError,
                    dateclaim: this.PLSCDateClaim,
                    indicatewhethera: this.PLSCIndicateWhetherA,
                    nameinsuandpolicy: this.PLSCNameInsuAndPolicy,
                    agentsname: this.PLSCAgentsName,
                    telephonenumber: this.PLSCTelephoneNumber,
                    location: this.PLSCLocation,
                    casenumber: this.PLSCCaseNumber,
                    deflegrepname: this.PLSCDefLegRepName,
                    telephonenumber2: this.PLSCTelephoneNumber2,
                    address: this.PLSCAddress,
                    city: this.PLSCCity,
                    state: this.PLSCState,
                    zipcode: this.PLSCZipCode,
                    plainlegrepname: this.PLSCPlainLegRepName,
                    telephonenumber3: this.PLSCTelephoneNumber3,
                    address2: this.PLSCAddress2,
                    city2: this.PLSCCity2,
                    state2: this.PLSCState2,
                    zipcode2: this.PLSCZipCode2,
                    courtjudgement: this.PLSCCourtJudgement,
                    judgementfor: this.PLSCJudgementFor,
                    by: this.PLSCBy,
                    date: this.PLSCDate,
                    outcourtsettle: this.PLSCOutCourtSettle,
                    datesettle: this.PLSCDateSettle,
                    amountpaiddefbehalf: this.PLSCAmountPaidDefBehalf,
                    compensation: this.PLSCCompensation,
                    punitdamagawarded: this.PLSCPunitDamagAwarded,
                    totalcompensation: this.PLSCTotalCompensation,
                    claimcasedismised: this.PLSCClaimCaseDismised,
                    againstdefendant: this.PLSCAgainstDefendant,
                    againstalldefendants: this.PLSCAgainstAllDefendants,
                    date2: this.PLSCDate2,
                    description: this.PLSCDescription,
                    providerinitials: this.PLSCProviderInitials,
                    contactId: this.contactId,
                }
                
                console.log('input ' + input.iacknowledge);
    
                const url = await redirectToVisualforcePage({ inputValue: input, pageName: "ProfLiabSuppClaimsMultiForm" });
                
                // Redirect the user to the Visualforce page
                window.open(url, '_blank');
                location.reload();
            } catch (error) {
                // Handle error if needed
                console.error(error);
            } finally {
                this.isSubmitting = false;
            }
        } else {
            this.showToast();
            this.comboboxFieldsFilled = true;
            this.isSubmitting = false;
        }
    }

    // ----------------


    
    // ----------------

    handleProviderServicesAgreementOpen() {
        this.showProviderServicesAgreementForm = true;
    }
 
    handleProviderServicesAgreementClose() {
        this.showProviderServicesAgreementForm = false;
    }

    handlePSAEffectiveDateChange(event) {
        this.PSAEffectiveDate = event.target.value;
    }

    handlePSAContractorChange(event) {
        this.PSAContractor = event.target.value;
    }

    handlePSAContractorInitialsChange(event) {
        this.PSAContractorInitials = event.target.value;
    }

    handlePSAContractorSignatureChange(event) {
        this.PSAContractorSignature = event.target.value;
    }

    handlePSADateChange(event) {
        this.PSADate = event.target.value;
    }

    handlePSAPrintedNameChange(event) {
        this.PSAPrintedName = event.target.value;
    }

    handlePSAFederalTaxIdOrSecNumberChange(event) {
        this.PSAFederalTaxIdOrSecNumber = event.target.value;
    }

    handlePSAIntegritySignatureChange(event) {
        this.PSAIntegritySignature = event.target.value;
    }

    handlePSADate2Change(event) {
        this.PSADate2 = event.target.value;
    }

    handlePSAPrintedNameTitleChange(event) {
        this.PSAPrintedNameTitle = event.target.value;
    }

    async handleProviderServicesAgreementSubmit(event) {
        event.preventDefault();

        if (this.isSubmitting) {
            return
        }

        this.isSubmitting = true;

        if (this.PSAEffectiveDate == null || this.PSADate == null || this.PSADate2 == null) {
            this.comboboxFieldsFilled = false;
            console.log('combobox field ' + this.comboboxFieldsFilled);
        }

        if (this.comboboxFieldsFilled == true) {
            try {
                console.log('hello');
                // Call the Apex method to redirect to the Visualforce page
                let input = {
                    effectivedate: this.PSAEffectiveDate,
                    contractor: this.PSAContractor,
                    contractorinitials: this.PSAContractorInitials,
                    contractorsignature: this.PSAContractorSignature,
                    date: this.PSADate,
                    printedname: this.PSAPrintedName,
                    federaltaxidorsecnumber: this.PSAFederalTaxIdOrSecNumber,
                    integritysignature: this.PSAIntegritySignature,
                    date2: this.PSADate2,
                    printednametitle: this.PSAPrintedNameTitle,
                    contactId: this.contactId,
                }
                
                console.log('input ' + input.date);
    
                const url = await redirectToVisualforcePage({ inputValue: input, pageName: "ProviderServicesAgreement" });
                // Redirect the user to the Visualforce page
                window.open(url, '_blank');
                location.reload();
            } catch (error) {
                // Handle error if needed
                console.error(error);
            } finally {
                this.isSubmitting = false;
            }
        } else {
            this.showToast();
            this.comboboxFieldsFilled = true;
            this.isSubmitting = false;
        }
    } 

    // ----------------



    // ----------------

    handleCOVIDInternalClinicalScreeningAssessmentOpen() {
        this.showCOVIDInternalClinicalScreeningAssessmentForm = true;
    }
 
    handleCOVIDInternalClinicalScreeningAssessmentClose() {
        this.showCOVIDInternalClinicalScreeningAssessmentForm = false;
    }

    handleCICSAProviderNameChange(event) {
        this.CICSAProviderName = event.target.value;
    }

    handleCICSADateInterviewChange(event) {
        this.CICSADateInterview = event.target.value;
    }

    handleCICSALocationsChange(event) {
        this.CICSALocations = event.target.value;
    }

    handleCICSACurrentSymptomsChange(event) {
        this.CICSACurrentSymptoms = event.target.value;
    }

    handleCICSAProviderAroundCoronaChange(event) {
        this.CICSAProviderAroundCorona = event.target.value;
        if (this.CICSAProviderAroundCorona == 'yes') {
            this.showCOVIDIfYes = true;
        } else {
            this.showCOVIDIfYes = false;
        }
    }

    handleCICSAIfYes1Change(event) {
        this.CICSAIfYes1 = event.target.value;
    }

    handleCICSAIfYes2Change(event) {
        this.CICSAIfYes2 = event.target.value;
    }

    handleCICSAIfYes3Change(event) {
        this.CICSAIfYes3 = event.target.value;
    }

    handleCICSAIfYes4Change(event) {
        this.CICSAIfYes4 = event.target.value;
    }

    handleCICSAIfYes5Change(event) {
        this.CICSAIfYes5 = event.target.value;
    }

    handleCICSARiskCategoryChange(event) {
        this.CICSARiskCategory = event.target.value;
    }

    handleCICSAWorkRestrictionsChange(event) {
        this.CICSAWorkRestrictions = event.target.value;
        if (this.CICSAWorkRestrictions == 'exc') {
            this.showDateInput = true;
        } else {
            this.showDateInput = false;
        } 
    }

    handleCICSANameOfCredentialerChange(event) {
        this.CICSANameOfCredentialer = event.target.value;
    }

    handleCICSAElegDateChange(event) {
        this.CICSAElegDate = event.target.value;
    }

    async handleCOVIDInternalClinicalScreeningAssessmentSubmit(event) {
        event.preventDefault();

        if (this.isSubmitting) {
            return
        }

        this.isSubmitting = true;

        if (this.CICSAProviderAroundCorona == null || this.CICSARiskCategory == null || this.CICSAWorkRestrictions == null || this.CICSADateInterview == null) {
            this.comboboxFieldsFilled = false;
            console.log('combobox field ' + this.comboboxFieldsFilled);
        }   

        if (this.comboboxFieldsFilled == true) {
            try {
                console.log('hello');
                // Call the Apex method to redirect to the Visualforce page
                let input = {
                    providername: this.CICSAProviderName,
                    dateinterview: this.CICSADateInterview,
                    locations: this.CICSALocations,
                    currentsymptoms: this.CICSACurrentSymptoms,
                    provideraroundcorona: this.CICSAProviderAroundCorona,
                    ifyes1: this.CICSAIfYes1,
                    ifyes2: this.CICSAIfYes2,
                    ifyes3: this.CICSAIfYes3,
                    ifyes4: this.CICSAIfYes4,
                    ifyes5: this.CICSAIfYes5,
                    riskcategory: this.CICSARiskCategory,
                    workrestrictions: this.CICSAWorkRestrictions,
                    nameofcredentialer: this.CICSANameOfCredentialer,
                    elegdate: this.CICSAElegDate,
                    contactId: this.contactId,
                }
            
                console.log('input ' + input.ifyes4);
    
                const url = await redirectToVisualforcePage({ inputValue: input, pageName: "COVIDInternalClinicalScreeningAssessment" });
                // Redirect the user to the Visualforce page
                window.open(url, '_blank');
                location.reload();
            } catch (error) {
                // Handle error if needed
                console.error(error);
            } finally {
                this.isSubmitting = false;
            }
        } else {
            this.showToast();
            this.comboboxFieldsFilled = true;
            this.isSubmitting = false;
        }
    }

    // ----------------



    // ----------------

    handleCoronavirusScreeningFormOpen() {
        this.showCoronavirusScreeningForm = true}
 
    handleCoronavirusScreeningFormClose() {
        this.showCoronavirusScreeningForm = false}

    handleCSFLastNameChange(event) {
        this.CSFLastName = event.target.value;
    }

    handleCSFFirstNameChange(event) {
        this.CSFFirstName = event.target.value;
    }
    
    handleCSFMobileNumberChange(event) {
        this.CSFMobileNumber = event.target.value;
    }

    handleCSFEmailAddressChange(event) {
        this.CSFEmailAddress = event.target.value;
    }

    handleCSFTraveledInterChange(event) {
        this.CSFTraveledInter = event.target.value;
    }

    handleCSFFeverChange(event) {
        this.CSFFever = event.target.value;
    }

    handleCSFShortnessOfBreathChange(event) {
        this.CSFShortnessOfBreath = event.target.value;
    }

    handleCSFCoughChange(event) {
        this.CSFCough = event.target.value;
    }

    handleCSFContactWithCovidChange(event) {
        this.CSFContactWithCovid = event.target.value;
    }

    handleCSFFirstAndLastNameChange(event) {
        this.CSFFirstAndLastName = event.target.value;
    }

    async handleCoronavirusScreeningFormSubmit(event) {
        event.preventDefault();

        if (this.isSubmitting) {
            return
        }

        this.isSubmitting = true;

        if (this.CSFTraveledInter == null || this.CSFFever == null || this.CSFShortnessOfBreath == null || this.CSFCough == null || this.CSFContactWithCovid == null || !this.CSFEmailAddress.includes('@')) {
            this.comboboxFieldsFilled = false;
            console.log('combobox field ' + this.comboboxFieldsFilled);
        }  

        if (this.comboboxFieldsFilled == true) {
            try {
                console.log('hello');
                // Call the Apex method to redirect to the Visualforce page
                let input = {
                    lastname: this.CSFLastName,
                    firstname: this.CSFFirstName,
                    mobilenumber: this.CSFMobileNumber,
                    emailaddress: this.CSFEmailAddress,
                    traveledinter: this.CSFTraveledInter,
                    fever: this.CSFFever,
                    shortnessofbreath: this.CSFShortnessOfBreath,
                    cough: this.CSFCough,
                    contactwithcovid: this.CSFContactWithCovid,
                    firstandlastname: this.CSFFirstAndLastName,
                    contactId: this.contactId
                }
            
                console.log('input ' + input.ifyes4);
    
                const url = await redirectToVisualforcePage({ inputValue: input, pageName: "CoronavirusScreeningForm" });
                // Redirect the user to the Visualforce page
                window.open(url, '_blank');
                location.reload();
            } catch (error) {
                // Handle error if needed
                console.error(error);
            } finally {
                this.isSubmitting = false;
            }
        } else {
            this.showToast();
            this.comboboxFieldsFilled = true;
            this.isSubmitting = false;
        }
    }

    // ----------------



    // ----------------

    handleDirectDepositFormOpen() {
        this.showDirectDepositForm = true;
    }
 
    handleDirectDepositFormClose() {
        this.showDirectDepositForm = false;
    }

    handleDDFSelectOneChange(event) {
        this.DDFSelectOne = event.target.value;
    }

    handleDDFNameBankChange(event) {
        this.DDFNameBank = event.target.value;
    }

    handleDDFTransitNumChange(event) {
        this.DDFTransitNum = event.target.value;
    }

    handleDDFAccountChange(event) {
        this.DDFAccount = event.target.value;
    }

    handleDDFPayeeNameChange(event) {
        this.DDFPayeeName = event.target.value;
    }

    handleDDFSignatureChange(event) {
        this.DDFSignature = event.target.value;
    }

    handleDDFDateChange(event) {
        this.DDFDate = event.target.value;
    }

    handleDDFSocialSecNumChange(event) {
        this.DDFSocialSecNum = event.target.value;
    }

    handleDDFEmailAddChange(event) {
        this.DDFEmailAdd = event.target.value;
    }

    async handleDirectDepositFormSubmit(event) {
        event.preventDefault();

        console.log(this.isSubmitting);

        if (this.isSubmitting) {
            return
        }

        this.isSubmitting = true;

        if (this.DDFSelectOne == null || this.DDFDate == null || !this.DDFEmailAdd.includes('@') ) {
            this.comboboxFieldsFilled = false;
            console.log('combobox field ' + this.comboboxFieldsFilled);
        }  

        if (this.comboboxFieldsFilled == true) {
            try {
                console.log('hello');
                // Call the Apex method to redirect to the Visualforce page
                let input = {
                    selectone: this.DDFSelectOne,
                    namebank: this.DDFNameBank,
                    transitnum: this.DDFTransitNum,
                    account: this.DDFAccount,
                    payeename: this.DDFPayeeName,
                    signature: this.DDFSignature,
                    date: this.DDFDate,
                    socialsecnum: this.DDFSocialSecNum,
                    emailadd: this.DDFEmailAdd,
                    contactId: this.contactId,
                }
            
                console.log('input ' + input.ifyes4);
    
                const url = await redirectToVisualforcePage({ inputValue: input, pageName: "DirectDepositForm" });
                // Redirect the user to the Visualforce page
                window.open(url, '_blank');
                location.reload();
            } catch (error) {
                // Handle error if needed
                console.error(error);
            } finally {
                this.isSubmitting = false;
            }
        } else {
            this.showToast();
            this.comboboxFieldsFilled = true;
            this.isSubmitting = false;
        }
    }

    // ----------------

    showToast() {
        const event = new ShowToastEvent({
            title: 'Error',
            message: 'Picklist Field Errors: All picklist fields must have a value. Email Field Errors: Be sure to enter an email with a valid format.',
            variant: 'error',
            mode: 'dismissable',
            duration: 20000,
        });
        this.dispatchEvent(event);
    }

    getCurrentDate() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${month}/${day}/${year}`;

        return formattedDate;
    }
}