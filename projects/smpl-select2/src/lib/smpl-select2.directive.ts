import { OnInit, Directive, forwardRef, Input, OnChanges, Output, EventEmitter, SimpleChanges, ElementRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Select2Config, Select2DataSource } from './smpl-select2.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import $ from 'jquery';
import 'select2';

@Directive({
  selector: '[smplSelect2]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SmplSelect2Directive),
      multi: true
    }
  ]
})
export class SmplSelect2Directive implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {

  @Input('smplSelect2') configOptions: Select2Config;

  @Input() dataSource: Select2DataSource;

  @Input('static')
  get staticOptionData() { return this._staticOptionData; }
  set staticOptionData(staticOptionData: boolean) {
    this._staticOptionData = staticOptionData !== undefined;
  }
  private _staticOptionData: boolean;

  @Input() displayProperty: string = 'text';
  @Input() valueProperty: string = 'id';

  @Input() placeholder: string = '(NONE)';

  @Output('select') onSelect: EventEmitter<any> = new EventEmitter();
  @Output('unselect') onUnselect: EventEmitter<any> = new EventEmitter();

  private _dataSourceReadySubject = new BehaviorSubject<boolean>(false);
  private _dataSourceReadySubscription: Subscription;

  private get value() { return this._value; }
  private set value(newValue: any) {
    if (this._value === newValue) {
      return;
    }
    this._value = newValue;
    this._triggerChange(this._value);
  }
  private _value: any;

  private _disabled: boolean;

  private _onChanged: any = () => { };
  private _onTouched: any = () => { };

  constructor(
    private _el: ElementRef
  ) { }

  ngOnInit(): void {
    this._setup();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.configOptions && !changes.configOptions.firstChange) {
      this._setup();
    }

    if (changes.dataSource && !changes.dataSource.firstChange) {
      this._renderData();
    }
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
      if (!rendered) {
        return;
      }

      this.value = newValue;

      if (this.configOptions.multiple) {
        // sometimes the value is casted into string, thus use '==' instead of '==='
        // tslint:disable-next-line:triple-equals
        const selectedOptions = this.configOptions.data.filter(item => (this.value || []).includes(item[this.valueProperty]));
        this.onSelect.emit(selectedOptions);
      } else {
        // sometimes the value is casted into string, thus use '==' instead of '==='
        // tslint:disable-next-line:triple-equals
        const selectedOption = this.configOptions.data.find(item => item[this.valueProperty] == this.value);
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

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;

    const $element = $(this._el.nativeElement);
    $element.prop('disabled', isDisabled);
  }

  private _setup() {

    this._initConfigOptions();

    this._registerSelectEvent();
    this._registerUnselectEvent();

    this._setupTemplateResultFunction();
    this._setupTemplateSelectionFunction();

    this._renderData();
  }

  private _initConfigOptions(): void {
    const defaultOptions = {
      placeholder: this.placeholder,
      allowClear: true,
      theme: 'classic',
      width: 'resolve'
    };

    this.configOptions = Object.assign(defaultOptions, this.configOptions || {});

    // completely remove default behavior of native select
    $(this._el.nativeElement).on('keypress', (e) => {
      e.preventDefault();
    });

    // completely prevent user interaction on disabled
    $(this._el.nativeElement).on('select2:opening', (e) => {
      if (this._disabled) {
        e.preventDefault();
      }
    });
  }

  private _registerSelectEvent(): void {
    $(this._el.nativeElement).off('select2:select').on('select2:select', (e) => {

      const selectedValue = e.params.data[this.valueProperty];

      if (this.configOptions.multiple) {
        const value = [...(this.value || []), selectedValue];
        this.writeValue(value);
      } else {
        this.writeValue(selectedValue);
      }

      // writeValue() is for programmatic changes, UI changes need some more steps belows
      this._onChanged(this.value);
      this._onTouched(this.value);
    });
  }

  private _registerUnselectEvent(): void {
    $(this._el.nativeElement).off('select2:unselect').on('select2:unselect', (e) => {

      const unselectedValue = e.params.data[this.valueProperty];

      // sometimes the value is casted into string, thus use '==' instead of '==='
      // tslint:disable-next-line:triple-equals
      const unselectedOption = this.configOptions.data.find(item => item[this.valueProperty] == unselectedValue);

      this.onUnselect.emit(unselectedOption);

      if (this.configOptions.multiple) {
        const value = (this.value || []).filter(item => item != unselectedValue);
        this.writeValue(value);
      } else {
        this.writeValue(null);
      }

      // writeValue() is for programmatic changes, UI changes need some more steps belows
      this._onChanged(this.value);
      this._onTouched(this.value);
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

  private _renderData(): void {
    if (!this.staticOptionData) {
      this._setupDataSource();
    }

    this._renderComponent();
  }

  private _setupDataSource(): void {

    // Scrolling bug: Select2 has dynamic datasource. Select2 container is a scrollable element other than body.
    //                Open select2 when data is empty, stay there until data is set.
    //                Close selection panel. The container is unable to scroll.
    // Workaround: Disable select2 to prevent opening selection panel before data is set.
    if (!this.dataSource?.data?.length && !this.dataSource?.ajaxFn) {
      this.setDisabledState(true);
    } else {
      this.setDisabledState(false);
    }

    this.dataSource = this.dataSource || {};

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
          searchText: params.term
        };
        return query;
      },
      processResults: (data) => {
        return {
          results: this._transformData(data)
        };
      },
      transport: (requestData, success, failure) => {
        dataSource.ajaxFn(requestData.data.searchText).subscribe(
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
    const dataTransformFn = this.dataSource.dataTransformFn || this._defaultDataTransformFn.bind(this);
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

  private _renderComponent(): void {
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
