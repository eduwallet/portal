export interface Iam {
    _ID: string;
    uid: string;
    eduPersonUniqueId: string;
    eduPersonPrincipalName: string;
    givenName: string;
    sn: string;
    displayName: string;
    schacHomeOrganization: string;
    mail: string;
    eduPersonAffiliation: string[];
    eduPersonScopedAffiliation: string[];
    eduPersonEntitlement: string[];
    eduPersonAssurance: string[];
    _ttl: string;
}

export interface Sis {
    _ID: string;
    Student_ID: string;
    IsStudent: string;
    StudentType: string;
    Gender: string;
    GivenName: string;
    Surname: string;
    Type: string;
    StreetAddress: string;
    City: string;
    ZipCode: string;
    CountryFull: string;
    PrivateEmailAddress: string;
    TelephoneNumber: string;
    TelephoneCountryCode: string;
    BSN: string;
    Nationality: string;
    DoB: string;
    _PBD: string;
}