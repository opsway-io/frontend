import { FunctionComponent } from "react";
import * as React from "react";
import Flatpickr from "react-flatpickr";

interface DateRangePickerProps {}

const DatePicker: FunctionComponent<DateRangePickerProps> = (props) => {
  const [dateStart, handleDateStart] = React.useState(new Date());
  const [dateEnd, handleDateEnd] = React.useState(new Date());

  return (
    <Flatpickr
      data-enable-time
      value={dateStart}
      onChange={(date: any) => {
        handleDateStart(date);
      }}
    />
  );
};

export default DatePicker;
