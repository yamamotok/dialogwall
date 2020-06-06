DialogWall
=============

A React component which provides mechanism to show modal dialogs,
with very basic built-in dialog and spinner components.

## Installation

```shell
npm install --save dialogwall
```
Type definition is included.


## React version

Since this library is using hook, React version must be >= 16.8


## Setup

Place `<DialgWall>` as a HOC.

```typescript jsx
ReactDOM.render(
  <React.StrictMode>
    <DialogWall>
      <App />
    </DialogWall>
  </React.StrictMode>,
  document.getElementById('root')
);
```

## Use Built-in Dialog

Show a simple dialog with white dialog box.  
[Bootstrap](https://getbootstrap.com/) is necessary. (Peer dependency)

```typescript jsx
const Tester: React.FC = (props) => {
  const dialog = useDialog();

  const onClick: MouseEventHandler = (e) => {
    dialog
      .builder()
      .setMessage('Hello World')
      .setPositiveButton('Accept') /* Optional */
      .setNegativeButton('Decline') /* Optional */
      .setResultCallback((result) => console.log(result)) /* Optional */
      .setSpec({ useEscForCancel: true }) /* Optional */
      .show();
  };
 
  return (
    <div>
      <button onClick={onClick}>Show dialog</button>
    </div>
  );
};
```

## Use Built-in Spinner

Show a simple loading spinner.  
Implemented by using CSS spinner from [Loading.io](https://loading.io/css/).

```typescript jsx
const Tester: React.FC = (props) => {
  const dialog = useDialog();

  const show: MouseEventHandler = (e) => {
    dialog
      .spinnerBuilder()
      .setTimeout(30 * 1000) /* Optional */
      .show();
  };
  
  // Call `dialog.discard()` to hide spinner,
  // when state was changed for example.
 
  return (
    <div>
      <button onClick={show}>Show spinner</button>
    </div>
  );
};
```


## Use Custom Dialog

Show a custom dialog you created.

```typescript jsx
const CustomDialog: DialogComponent = (props) => {
  const onClick: MouseEventHandler = (e) => props.close('Liked');
  return (
    <div>
      <button onClick={onClick}>Like</button>
    </div>
  );
};

const Page: React.FC = () => {
  const dialog = useDialog();
  const onClick: MouseEventHandler = (e) => {
    dialog.show({
      component: CustomDialog,
      onClose: (reason) => console.log(reason),
    });
  };
  return (
    <div>
      <button onClick={onClick}>Show dialog</button>
    </div>
  );
}
```

## Licence

MIT  

