import { TestBed, inject } from '@angular/core/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SjLoggerService } from './logger.service';

describe('Service: SjLoggerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()],
      providers: [SjLoggerService]
    });
  });

  it(
    'should be injected',
    inject([SjLoggerService], (service: SjLoggerService) => {
      expect(service).toBeTruthy();
      expect(service.toastr instanceof ToastrService).toBeTruthy();
    })
  );

  it(
    'should provide error api function',
    inject([SjLoggerService], (service: SjLoggerService) => {
      spyOn(service.toastr, 'error');
      service.error('boom!');
      expect(service.toastr.error).toHaveBeenCalledWith('[Error]: boom!');
    })
  );

  it(
    'should provide info api function',
    inject([SjLoggerService], (service: SjLoggerService) => {
      spyOn(service.toastr, 'info');
      service.info('boom!');
      expect(service.toastr.info).toHaveBeenCalledWith('[Info]: boom!');
    })
  );

  it(
    'should provide success api function',
    inject([SjLoggerService], (service: SjLoggerService) => {
      spyOn(service.toastr, 'success');
      service.success('boom!');
      expect(service.toastr.success).toHaveBeenCalledWith('[Success]: boom!');
    })
  );

  it(
    'should provide warn api function',
    inject([SjLoggerService], (service: SjLoggerService) => {
      spyOn(service.toastr, 'warn');
      service.warn('boom!');
      expect(service.toastr.warning).toHaveBeenCalledWith('[Warning]: boom!');
    })
  );
});
