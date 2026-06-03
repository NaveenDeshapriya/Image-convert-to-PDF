import { launchImageLibraryAsync, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { printToFileAsync } from "expo-print";
import { shareAsync } from 'expo-sharing';

export default function App() {

  const [assets, setAssets] = useState<string[]>([]);

  // media permission manage

  const pickImage = async () => {

    const permission = await requestMediaLibraryPermissionsAsync();

    if (!permission.granted) return console.log("Permission denited. Allow your permission.");

    const media = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.6,
      base64: true, // image path convert base64 access 
      selectionLimit: 5,
    });


    if (media.canceled) return console.log("Cancel..");

    // assets can get
    // convert to images path base 64 for convert pdf file html access to data

    const urls = media.assets.map((result) => `data:image/jpeg;base64,${result.base64}`); // convert file path base64 string format


    setAssets(urls);



  }


  return (
    <View style={styles.container}>


      <View style={{ width: "100%", gap: 3 }}>
        <FlatList horizontal data={assets} renderItem={({ item }) => {

          return (
            <Image source={{ uri: item }} style={{ width: 130, height: 220, borderRadius: 12 }} />
          );

        }} />

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Selected pages:</Text>

        <TouchableOpacity style={styles.add} onPress={() => pickImage()}><Text style={styles.text}>Add Image</Text></TouchableOpacity>


        {/* next images convert pdf  */}

        <TouchableOpacity style={styles.pdf} onPress={async () => {


          

          // first create html content open pdf file

          // images url need to iterate img tag

          const { uri } = await printToFileAsync({
            html:`<body>
            
            <div style="page-break-after:always;">
            
            ${

              assets.map((result)=>(

                `<img src="${result}" style="width:100%; height:'auto';"/>`
              ))

            }
            
            
            </div>
            
            
            </body>`
          });

          // create pdf share 

          await shareAsync(uri,{
            dialogTitle:"android",// create ui compatible android ui design
            mimeType:"application/pdf" // file share data type
          });





        }}><Text style={styles.text}>Convert Image To PDF</Text></TouchableOpacity>

      </View>


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8
  },

  add: {
    backgroundColor: "gray",
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pdf: {
    backgroundColor: "black",
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },

  clear: {
    backgroundColor: "red",
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: "white"
  }

});
