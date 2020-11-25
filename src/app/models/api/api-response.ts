export class ApiResponse {
  status: number;
  message: string;
  result: any;

  public get isSuccess(): boolean {
    return this.message == "success"
  }
}
