import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { LibComponent } from './component/lib.component';
import { LibService } from './service/lib.service';
import { SjLoggerService } from './service/logger.service';

@NgModule({
  imports: [BrowserAnimationsModule, ToastrModule.forRoot()],
  declarations: [LibComponent],
  providers: [LibService, SjLoggerService],
  exports: [LibComponent, SjLoggerService]
})
export class LibModule {}
