import { Phone } from "../gql/schema";

export function containsObject({obj, list} : {obj: Phone, list: Phone[]}) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].number === obj.number) {
            return true;
        }
    }

    return false;
}