import { OnInit, Directive, forwardRef, Input, OnChanges, Output, EventEmitter, SimpleChanges, ElementRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Select2Config, Select2DataSource } from './smpl-select2.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import $ from 'jquery';
import 'select2';

@Directive({
  selector: '[smpl-select2]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SmplSelect2Directive),
      multi: true
    }
  ]
})
export class SmplSelect2Directive implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {

  @Input('smpl-select2') configOptions: Select2Config;

  @Input() dataSource: Select2DataSource;

  @Input('static') staticOptionData: boolean = false;

  @Input() displayProperty: string = 'text';
  @Input() valueProperty: string = 'id';

  @Output('select') onSelect: EventEmitter<any> = new EventEmitter();
  @Output('unselect') onUnselect: EventEmitter<any> = new EventEmitter();

  private _dataSourceReadySubject = new BehaviorSubject<boolean>(false);
  private _dataSourceReadySubscription: Subscription;

  private _value: any;
  private set value(newValue: any) {
    if (this._value === newValue) {
      return;
    }

    this._value = newValue;

    this._triggerChange(this._value);
  }

  private _onChanged: any = () => { };
  private _onTouched: any = () => { };

  constructor(
    private _el: ElementRef
  ) { }

  ngOnInit(): void {
    this._setup();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._setup();
  }

  ngOnDestroy(): void {
    if (this._dataSourceReadySubscription) {
      this._dataSourceReadySubscription.unsubscribe();
    }
  }

  writeValue(newValue: any): void {

    if (this.staticOptionData) {
      this.value = newValue;
      this.onSelect.emit(newValue);
      return;
    }

    // ignore old callback to avoid value conflict
    if (this._dataSourceReadySubscription) {
      this._dataSourceReadySubscription.unsubscribe();
    }

    // only set new value when data source is ready
    this._dataSourceReadySubscription = this._dataSourceReadySubject.asObservable().subscribe(rendered => {
      if (rendered) {
        this.value = newValue;

        // sometimes the value is casted into string, thus use '==' instead of '==='
        // tslint:disable-next-line:triple-equals
        const selectedOption = this.configOptions.data.find(item => item[this.valueProperty] == newValue);
        this.onSelect.emit(selectedOption);
      }
    });
  }

  registerOnChange(fn: any): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  private _setup() {

    this._initConfigOptions();

    this._registerSelectEvent();
    this._registerUnselectEvent();

    this._setupTemplateResultFunction();
    this._setupTemplateSelectionFunction();

    this._renderOptions();
  }

  private _initConfigOptions(): void {
    const defaultOptions = {
      placeholder: '(NONE)',
      allowClear: true,
      theme: 'classic',
      width: 'resolve'
    };

    this.configOptions = Object.assign(defaultOptions, this.configOptions || {});
  }

  private _registerSelectEvent(): void {
    $(this._el.nativeElement).off('select2:select').on('select2:select', (e) => {
      if (this.configOptions.multiple) {
        // TODO: Handle data for multiple selections
      } else {
        this.writeValue(e.params.data[this.valueProperty]);
      }

      // writeValue() is for programmatic changes, UI changes need some more steps belows
      this._onChanged(this._value);
      this._onTouched(this._value);
    });
  }

  private _registerUnselectEvent(): void {
    // TODO: Handle unselect event for multiple selections
    $(this._el.nativeElement).off('select2:unselect').on('select2:unselect', (e) => {
      this.writeValue(null);
      this.onUnselect.emit(e.params.data);

      // writeValue() is for programmatic changes, UI changes need some more steps belows
      this._onChanged(this._value);
      this._onTouched(this._value);
    });
  }

  private _setupTemplateResultFunction(): void {
    if (this.configOptions.templateResult) {
      this.configOptions.templateResult = this._wrapTemplateFunction(this.configOptions.templateResult);
    }
  }

  private _setupTemplateSelectionFunction(): void {
    if (this.configOptions.templateSelection) {
      this.configOptions.templateSelection = this._wrapTemplateFunction(this.configOptions.templateSelection);
    }
  }

  private _wrapTemplateFunction(templateFn: (dataItem: any) => any): (dataItem: any) => any {
    return (data) => {
      // TODO: Escape html template to avoid XSS
      return data[this.valueProperty]
        ? $(`<div>${templateFn(data)}</div>`)
        : this.configOptions.placeholder;
    };
  }

  private _renderOptions(): void {
    if (this.dataSource) {
      this._setupDataSource();
    }

    this._render();
  }

  private _setupDataSource(): void {
    // start a new data source setup process
    if (this._dataSourceReadySubject.value) {
      this._dataSourceReadySubject.next(false);
    }

    if (this.dataSource.ajaxFn) {
      this._buildAsyncDataSource(this.dataSource);
    }

    this._setDataSource(this.dataSource.data);
  }

  private _buildAsyncDataSource(dataSource: Select2DataSource): void {
    this.configOptions.ajax = {
      delay: dataSource.ajaxDelay,
      data: (params) => {
        const query = {
          q: params.term
        };
        return query;
      },
      processResults: (data) => {
        return {
          results: this._transformData(data)
        };
      },
      transport: (params, success, failure) => {
        dataSource.ajaxFn.subscribe(
          (data) => {
            this.configOptions.data = data;
            success(data);
          },
          (error) => failure(error)
        );
      }
    };
  }

  private _setDataSource(data: any[]): void {
    this.configOptions.data = this._transformData(data || []);
    this._dataSourceReadySubject.next(true);
  }

  private _transformData(data: any[]): any[] {
    const dataTransformFn = this.dataSource.transformFn || this._defaultDataTransformFn.bind(this);
    return dataTransformFn(data);
  }

  private _defaultDataTransformFn(data: any[]): any[] {
    return data.map(item => {
      return Object.assign({}, item, {
        id: item[this.valueProperty],
        text: item[this.displayProperty]
      });
    });
  }

  private _render(): void {
    this._initializeSelect2(this.configOptions);
    this._triggerChange(this._value);
  }

  private _initializeSelect2(options: Select2Config): void {
    const $element = $(this._el.nativeElement);

    if (!this.staticOptionData) {
      // keep the empty option to show placeholder (if any)
      $element.find('option').not(':first-child:not([value])').remove();
    }

    // select2 has been initialized
    if ($element.hasClass('select2-hidden-accessible')) {
      $element.select2('destroy');
    }

    $element.select2(options);
  }

  private _triggerChange(value: any): void {
    $(this._el.nativeElement).val(value).trigger('change');
  }

}
