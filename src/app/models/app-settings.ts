import { environment } from "../../environments/environment";

export class AppSettings {
  public static puId = 1;

  public static readonly PAGE_SIZE = 15;

  public static readonly API_URL = environment.apiUrl;

  public static readonly ReportServer = environment.reportRouteUrl;
}
