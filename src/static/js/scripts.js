const select = options => $('<select>').append(options);
const column = content => $('<td>', { class: 'col' }).append(content);
const input = props => $('<input>', props);

const colors = [
  { value: 1, text: 'Punainen', color: 'red' },
  { value: 2, text: 'Sininen', color: 'blue' },
  { value: 3, text: 'Vihreä', color: 'green' }
];

const sizes = [
  { value: 1, text: 'Small' },
  { value: 2, text: 'Medium' },
  { value: 3, text: 'Large' }
];

const options = _.map(({ value, text }) => $('<option>', { value }).text(text));

const colorSelection = () => column([select(options(colors))]);

const sizeSelection = () => column(select(options(sizes)));

const amountSelection = () => column(input({ type: 'number' }));

const deleteRow = id => () => $(`#${id}`).remove();

const deleteButton = id =>
  input({ type: 'button', class: 'delete-button', value: 'X' }).click(deleteRow(id));

const deleteRowButton = id => $('<td>', { class: 'col' }).append(deleteButton(id));

const mapColumnsToRow = id => _.map(fn => fn(id));

const columns = id => {
  const colGenerator = mapColumnsToRow(id);
  return colGenerator([colorSelection, sizeSelection, amountSelection, deleteRowButton]);
};

const row = id => $('<tr>', { class: 'row', id }).append(columns(id));

const ids = _.map(el => parseInt(el.id, 10));

const generateId = rows => {
  const currentMax = _.max(ids(rows));
  return currentMax < 0 ? 0 : currentMax + 1;
};

const addRow = () => $('#table-body').append(row(generateId($('.row'))));

$('#addrow').click(addRow);

$('#logout').click(async () => {
  window.location.href = `${window.location.origin}/logout`;
});
