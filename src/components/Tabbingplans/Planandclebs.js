import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Navbar from '../navbar';
import Header from '../Header';
import Footer from '../Footer';


export default function LabTabs() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
     <section className="page-controls">  
    <Header/>
    <Navbar/>
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Details" value="1" />
            <Tab label="Wishlist" value="2" />
            <Tab label="Guests" value="3" />
            <Tab label="History" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">Deatils</TabPanel>
        <TabPanel value="2">Wishlist</TabPanel>
        <TabPanel value="3">Guests</TabPanel>
        <TabPanel value="4">History</TabPanel>
      </TabContext>
    </Box>
    <Footer/>
    </section>
</>
  );
}
