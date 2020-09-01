import { Observable } from 'rxjs';

export interface Select2Config {
  allowClear?: boolean;
  placeholder?: string;

  disabled?: boolean;
  multiple?: boolean;
  selectOnClose?: boolean;
  closeOnSelect?: boolean;

  maximumInputLength?: number;
  maximumSelectionLength?: number;
  minimumInputLength?: number;
  minimumResultsForSearch?: number;

  data?: any[];
  ajax?: any;
  sorter?: (data: any[]) => any[];

  escapeMarkup?: (item: any) => string;
  templateResult?: (item: any) => string;
  templateSelection?: (item: any) => string;

  containerCss?: any;
  containerCssClass?: string;
  dropdownCss?: any;
  dropdownCssClass?: string;
  
  dropdownAutoWidth?: boolean;

  width?: string;
  theme?: string;
  language?: string;
}

export interface Select2DataSource {
  data?: any[];

  ajaxFn?: (searchText?: string) => Observable<any[]>;
  ajaxDelay?: number;

  dataTransformFn?: (data: any[]) => Select2Option[];
}

export interface Select2Option {
  id: any;
  text: any;
  selected?: boolean;
  disabled?: boolean;
  children?: Select2Option[];
}
