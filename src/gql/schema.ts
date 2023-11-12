export interface Phone {
    number: string
    __typename?: string
}

export interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    phones: Array<Phone>;
  }
  
export interface ContactData {
    contact: Contact[];
    contact_by_pk? : Contact,
    update_contact_by_pk? : Contact,
    

  }

export interface AddNumberReturnData {
    insert_phone : {
      returning : {
        contact: Contact
      }[]
    }
}

export interface DeleteNumberReturnData {
  delete_phone_by_pk : {
    contact : Contact
  }
}

export interface ContactVars {
    offset? : number,
    limit? : number,
    where? : {},
    order_by? : {},
    q? : string,
    id?: number
}

export interface AddContactVars {
  first_name : string,
  last_name : string,
  phones : Phone[]
}

export interface AddNumberVars {
  contact_id: number,
  phone_number: string
}

export interface DeleteContactVars {
  id: number
}

export interface DeleteNumberVars {
  contact_id: number,
  number: string
}

export interface EditContactVars {
  id : number,
  _set : {
    first_name? :string,
    last_name?: string,
  }
}