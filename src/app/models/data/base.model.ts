import { ApiService } from "src/app/services/api.service";
import { Observable } from "rxjs";
import { ApiResponse } from "../api/api-response";
import { AppSettings } from "../app-settings";
import { User } from './user.model';
import { AuthService } from 'src/app/services/auth.service';
// import { BrigadeTypeEnum } from 'src/app/enums/enums';


/**
 * Базовый класс для обмена данными с сервером
 * Справочники наследуется с этого класса
 */
export abstract class BaseDictModel {
  protected controllerName: string;

  public successMessage: string = "";
  public errorMessage: string = "";



  constructor() {



  }

  public static getCurrentUser(): User{

    return BaseDictModel.getFromLocalStorage('currentUserOms') as User
  }

  public static setCurrentUser(data:User){

    BaseDictModel.setToLocalStorage('currentUserOms', data)
  }

  private static getFromLocalStorage(itemName: string): any{

    JSON.parse(localStorage.getItem(itemName))

  }


  private static setToLocalStorage(itemName:string, data:any){

    localStorage.setItem(itemName, JSON.stringify(data))
  }

  /**
   * метод для динамической создания класса - надо исправить
   * @param obj
   */
  public static to(obj:object):any {

    var classname = this.toString().split ('(' || /s+/)[0].split (' ' || /s+/)[1];

     var instance = eval(`new ${classname}()`);

    return Object.assign(instance, obj);
  }

  /**
   * устанавливает название контроллера для подключение к апи
   * @param name - название контроллера в апи
   */
  protected setControllerName(name: string): void {
    this.controllerName = name;
  }

  /**
   * загрузка страницы с пагинацией
   * @param page  - номер страницы, начинается с 1
   */
  public loadPage(page = 0) {
    if (page <= 0) page = 1;

    //const currentUser = BaseDictModel.getCurrentUser();

    var params = {
      pageNumber: page,
      pageSize: AppSettings.PAGE_SIZE
    };

    return this.getItemsByPage(params);
  }

  public delete() {
    return this.deleteItem(this);
  }

  public getAll() {
    return ApiService.instance.postByToken(`${this.controllerName}/All`);
  }

  /**
   * Загрузка всех коллекции по параметрам: $Controller/All(@param)
   * @param param  - параметр объект
   */
  public getAllByParam(param: object) {
    return ApiService.instance.postByToken(`${this.controllerName}/All`,param);
  }

  /**
   * удаление записи по ид
   * достаточно передать поле Id
   * @param item - экземпляр класса
   */
  public deleteItem(item: any) {
    return ApiService.instance.postByToken(
      `${this.controllerName}/Delete`,
      item
    );
  }

  /**
   * создаем нового объекта по параметрам
   * для репозиторий модели
   * @param item
   */
  protected saveNewItem(item: any) {
    return ApiService.instance.postByToken(
      `${this.controllerName}/Create`,
      item
    );
  }

  /**
   * сохраняем текущего объекта
   */
  public saveNew() {
    return ApiService.instance.postByToken(
      `${this.controllerName}/Create`,
      this
    );
  }

  /**
   * сохраняем объект по параметрам
   * для репозиторий модели
   * @param item
   */

  public updateItem(item: any) {
    return ApiService.instance.postByToken(
      `${this.controllerName}/Update`,
      item
    );
  }

  /**
   * загрузка с базы модели по уникальному номеру ид
   * @param Id  - идентификатор записи
   */
  public getById(Id: number) {

    return this.getByParams({
      Id: Id,
    });
  }

  /**
   * загрузка с базы модели по параметрам
   * $Controller/Get(param)
   * @param param - объект параметр
   */
  public getByParams(param: object) {
    return ApiService.instance.postByToken(`${this.controllerName}/Get`, param);
  }

  /**
   * Отправляет запрос по указанному экшену текущего контроллера
   * @param actionName Имя экшена который отправляем запрос
   * @param param параметры
   */
  public getActionResult(actionName: string, param?: object) {
    return ApiService.instance.postByToken(`${this.controllerName}/${actionName}`, param);
  }

  /**
   * пока не реализовано...
   * @param pageNumber
   * @param pageSize
   */
  /*public static FirstOrDefault<T>(Id: number): T {

        const className = this.toString().split ('(' || /s+/)[0].split (' ' || /s+/)[1];

        ApiService.instance.postByToken(`${className}s/Get`, { "Id": Id }).subscribe(data => {
            const response = data as ApiResponse;
            return response.result as T;
        });
    }*/

  protected getItemsByPage(param: object): Observable<ApiResponse> {

    return ApiService.instance.postByToken(
      `${this.controllerName}/List`,
      param
    );
  }
}
