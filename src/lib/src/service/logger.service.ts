import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class SjLoggerService {
  constructor(public toastr: ToastrService, private enableDebug?: boolean) {}

  error(message: string) {
    this.toastr.error(`[Error]: ${message}`);
  }

  info(message: string) {
    this.toastr.info(`[Info]: ${message}`);
  }
  success(message: string) {
    this.toastr.success(`[Success]: ${message}`);
  }

  warn(message: string) {
    this.toastr.warning(`[Waring]: ${message}`);
  }

  log(...args: any[]) {
    if (this.enableDebug) {
      console.log.apply(window, args);
    }
  }
}
