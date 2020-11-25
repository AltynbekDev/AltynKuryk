import { Company } from "./company.model";
import { UserPermission } from './user-permission.model';
import { BaseDictModel } from './base.model';
import { ApiService } from 'src/app/services/api.service';

export class User extends BaseDictModel {


  
  Id: number;

  Name: string

  Pas: string

  Company: Company

  //Token: string;

  PuId: number

  roles: UserPermission[]

  access_token: string

  expires_in: number
  
  refresh_token: string
  
  token_type: string

  public static IsInRoles(roleList: string[]): boolean {

    return true

    const user = JSON.parse(localStorage.getItem("currentUser")) as User
       
    if (user){
      
      let curUserRoles = user.roles
      
      for(let role of roleList){

        let checkRole = curUserRoles.find(x=>x.Value == role)

        if (checkRole) return true

      }
    }

    return false

  }

  /**
   * 
   * @param actionName CREATE | UPDATE | DELETE | WELLTRANSFER (for RemontData, DelAnalyze)
   * @param modelName 
   */
  public static checkPermission(actionName: string, modelName?:string): boolean {

    const user = JSON.parse(localStorage.getItem("currentUser")) as User
       
    if (user){
      
      let curUserRoles = user.roles
      
      if (curUserRoles){

        /**
        * Если Пользователь то все действия недоступны
        */
       
        if (curUserRoles.find(x=>x.Value == "view")) return false
      
        if (curUserRoles.find(x=>x.Value == "admin")) return true
      }
      
    }

    return false

  }
}
