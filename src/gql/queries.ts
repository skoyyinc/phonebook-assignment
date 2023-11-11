import { gql } from "@apollo/client";

export const GET_CONTACT_LIST = gql`
    query GetContactList($offset: Int = 0, $limit: Int, $where : contact_bool_exp, $order_by: [contact_order_by!]) {
      contact(offset: $offset, limit: $limit, where : $where, order_by : $order_by) {
        id
        first_name
        last_name
        phones {
            number
        }
      }
    }
  `

export const GET_TOTAL_COUNT = gql`
  query GetContactList($where : contact_bool_exp) {
    contact(where : $where) {
      id 
    }
  }
`

export const GET_NAMES = gql`
  query GetContactList {
    contact {
      
      first_name
      last_name
      
    }
  }
`

export const SEARCH_CONTACT = gql`

query SearchContact($where : contact_bool_exp, $q : String, $limit : Int) {
  contact(where: {_or : [{first_name : {_ilike : $q}}, {last_name : {_ilike : $q}}]}, limit: $limit) {
    id 
    first_name
    last_name
    phones {
      number
    }
  }
}

`

export const ADD_CONTACT = gql`

mutation AddContactWithPhones(
  $first_name: String!, 
  $last_name: String!, 
  $phones: [phone_insert_input!]!
  ) {
insert_contact(
    objects: {
        first_name: $first_name, 
        last_name: 
        $last_name, phones: { 
            data: $phones
          }
      }
  ) {
  returning {
    first_name
    last_name
    id
    phones {
      number
    }
  }
}
}

`
export const GET_CONTACT_BY_ID = gql`
query GetContactDetail($id: Int!){
  contact_by_pk(id: $id) {
  last_name
  id
  first_name
  created_at
  phones {
    number
  }
}
}


`

export const ADD_NUMBER_TO_CONTACT = gql`

mutation AddNumberToContact ($contact_id: Int!, $phone_number:String!) {
  insert_phone(objects: {contact_id: $contact_id, number: $phone_number}) {
    returning {
      contact {
        id
        last_name
        first_name
        phones {
          number
        }
      }
    }
  }
}
`

export const DELETE_CONTACT = gql`
  mutation MyMutation($id: Int!) {
    delete_contact_by_pk(id: $id) {
      first_name
      last_name
      id
    }
  }
`
