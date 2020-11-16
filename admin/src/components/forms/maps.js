// import React from 'react';
// import TextField from '@material-ui/core/TextField';
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import LocationOnIcon from '@material-ui/icons/LocationOn';
// import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
// import { makeStyles } from '@material-ui/core/styles';
// import parse from 'autosuggest-highlight/parse';
// import throttle from 'lodash/throttle';

// function loadScript(src, position, id) {
//   if (!position) {
//     return;
//   }

//   const script = document.createElement('script');
//   script.setAttribute('async', '');
//   script.setAttribute('id', id);
//   script.src = src;
//   position.appendChild(script);
// }

// const autocompleteService = { current: null };

// const useStyles = makeStyles((theme) => ({
//   icon: {
//     color: theme.palette.text.secondary,
//     marginRight: theme.spacing(2),
//   },
// }));

// export default function GoogleMaps() {
//   const classes = useStyles();
//   const [value, setValue] = React.useState(null);
//   const [inputValue, setInputValue] = React.useState('');
//   const [options, setOptions] = React.useState([]);
//   const loaded = React.useRef(true);

//   if (typeof window !== 'undefined' && !loaded.current) {
//     if (!document.querySelector('#google-maps')) {
//       loadScript(
//         "https://maps.googleapis.com/maps/api/js?key=AIzaSyBmQdEHeqn5T-7PU8fNi-KhNx061DgX8KU&libraries=places",
//         document.querySelector('head'),
//         'google-maps',
//       );
//     }
//     loaded.current = true;
//   }

//   const fetch = React.useMemo(
//     () =>
//       throttle((request, callback) => {
//         autocompleteService.current.getPlacePredictions(request, callback);
//       }, 200),
//     [],
//   );

//   React.useEffect(() => {
//     let active = true;

//     if (!autocompleteService.current && window.google) {
//       autocompleteService.current = new window.google.maps.places.AutocompleteService();
//     }
//     if (!autocompleteService.current) {
//       return undefined;
//     }

//     if (inputValue === '') {
//       setOptions(value ? [value] : []);
//       return undefined;
//     }

//     fetch({ input: inputValue }, (results) => {
//       if (active) {
//         let newOptions = [];

//         if (value) {
//           newOptions = [value];
//         }

//         if (results) {
//           newOptions = [...newOptions, ...results];
//         }

//         setOptions(newOptions);
//       }
//     });

//     return () => {
//       active = false;
//     };
//   }, [value, inputValue, fetch]);

//   return (
//     <Autocomplete
//       id="google-map-demo"
//       style={{ width: 300 }}
//       getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
//       filterOptions={(x) => x}
//       options={options}
//       autoComplete
//       includeInputInList
//       filterSelectedOptions
//       value={value}
//       onChange={(event, newValue) => {
//         setOptions(newValue ? [newValue, ...options] : options);
//         setValue(newValue);
//       }}
//       onInputChange={(event, newInputValue) => {
//         setInputValue(newInputValue);
//       }}
//       renderInput={(params) => (
//         <TextField {...params} label="Nueva Ubicacion" variant="outlined" fullWidth />
//       )}
//       renderOption={(option) => {
//         const matches = option.structured_formatting.main_text_matched_substrings;
//         const parts = parse(
//           option.structured_formatting.main_text,
//           matches.map((match) => [match.offset, match.offset + match.length]),
//         );

//         return (
//           <Grid container alignItems="center">
//             <Grid item>
//               <LocationOnIcon className={classes.icon} />
//             </Grid>
//             <Grid item xs>
//               {parts.map((part, index) => (
//                 <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
//                   {part.text}
//                 </span>
//               ))}

//               <Typography variant="body2" color="textSecondary">
//                 {option.structured_formatting.secondary_text}
//               </Typography>
//             </Grid>
//           </Grid>
//         );
//       }}
//     />
//   );
// }
import React, { useState, useEffect } from "react";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import { withRouter } from "react-router-dom";
//import "./styles.css";

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

const App = ({ input, label, meta, history, ...custom }) => {
  const [inputValue, setInputValue] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [options, setOptions] = useState([]);
  const debounceOnChange = React.useCallback(
    debounce((value) => {
      setInputSearch(value);
    }, 400),
    []
  );
  let response = [0];
  const [open, setOpen] = React.useState(false);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;
    (async () => {
      response = await axios.get(
        "https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_svg=1&namedetails=1&q=:inputValue".replace(
          /:inputValue/gi,
          inputValue
        )
      );
      // if(response.length > 2){
      //   for (let res of response) {
      //     console.log(" adress1: ",response.display_name)
      //     debugger
      //     if (response[res].display_name === inputValue) {
      //       console.log(" adress: ",response.display_name)
      //       history.push({
      //         state: { location: response },
      //       });
      //       console.log("lat and long: ", response.lat, "-", response.lon);
      //     }
      //   }}
      if (active) {
        console.log(response.data);
        setOptions(response.data);
      }
    })();
  }, [inputSearch]);
  function handleChange(value) {
    history.push({
      state: { location: value},
    });
    setInputValue(value);
    debounceOnChange(value);
  }

  return (
    <div className="App">
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.display_name}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        autoComplete
        loading={loading}
        inputValue={inputValue}
        includeInputInList
        disableOpenOnFocus
        renderInput={(params) => (
          <TextField
            {...params}
            // // name="location"
            //label="Buscar Ubicacion"
            variant="outlined"
            onChange={(event) => handleChange(event.target.value)}
            // fullWidth
            // label={label}
            // // {...custom}
            label={label}
            //placeholder={label}
            // error={touched && invalid}
            // helperText={touched && error}
            //{...input}
            //   {...custom}
          />
        )}
        renderOption={(option) => {
          return <div>{option.display_name}</div>;
        }}
      />
    </div>
  );
};
export default withRouter(App);
