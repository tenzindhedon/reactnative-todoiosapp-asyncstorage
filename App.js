import React, {useState, useEffect} from 'react';
import {
  StyleSheet, FlatList, SafeAreaView, Alert
} from 'react-native';

import Header from './components/Header';
import ListItem from './components/ListItem';
import Modify from './components/Modify';

import AsyncStorage from '@react-native-async-storage/async-storage';

let move = 0; // To track item movement

const App = () => {
  const [list, setList] = useState([]);
  const [btnState, setBtnState] = useState(true);
  const [curId, setCurId] = useState(null);
  const [curIndex, setCurIndex]  = useState(null);
  const [timer, setTimer] = useState(0);

  // Get data from storage
  const loadStoredData = async () => {
    try {
      //  AsyncStorage.clear()
      const allKeys = await AsyncStorage.getAllKeys();
      if (allKeys.length > 0) {
        for (let i = 0; i < allKeys.length; i++) {
          let item = await AsyncStorage.getItem(allKeys[i])
          getStorageList(item);
        }
      }
    } catch (err) {
      Alert.alert("Failed to load storage data.\n" + err);
    }
  }
  // set each item from storage to display
  const getStorageList = (inItem) => {
    try {
      item = JSON.parse(inItem);
      if (list !== null) {
        setList((prevList) => {
          return [
            ...prevList,
            item
          ]
        })
      } else
          setList([item]);
    } catch (err) {
      Alert.alert("Cannot retrieve data\n" + err)
    }
  }
 
  // 
  useEffect(() => {
    loadStoredData();
  }, []);

  const handleClick = (id) => {
    var newTimer = new Date().getTime() - timer;
    setTimer(new Date().getTime());
    clearSelection();
    let selectedIndex = 0;
    for (let i = 0; i < list.length; i++) {
      if(list[i].id == id) {
        selectedIndex = i;
        list[i].viewStyle = styles.highlight;
        if (newTimer < 200) {
          if (list[i].textStyle === styles.none) 
            list[i].textStyle = styles.strikeThrough;
          else
            list[i].textStyle = styles.none;
        }
      } 
    }
    setCurIndex(selectedIndex);
    setBtnState(false);
    setCurId(id);
    resetStorage();
  }

  function clearSelection() {
    for (let i = 0; i < list.length; i++) {
      list[i].viewStyle = styles.listItemView;
    }
  }

  const addNewList = async(text) => {
    setBtnState(true);
    clearSelection();
    if (text == '')
      Alert.alert("No grocery list entered!");
    else {
      try  {
        let newId = '1';
        if (list !== null) {
          if (list.length === 1 && +list[0].id > 1)
            newId = (+list[0].id + 1).toString();
          else 
            newId = assignID();
        }
        let newObj = {id: newId, text:text, key:newId, viewStyle:styles.listItemView, textStyle:styles.none};
        if (list === null)
          setList([newObj]);
        else {
          setList((prevList) => {
            return [
              ...prevList,
              newObj
            ]
          })
        }
        await AsyncStorage.setItem('@key' + newId, JSON.stringify(newObj));
      } catch (err) {
        Alert.alert(err);
      }
    }
  }

  function assignID() {
    let id = 0;
    for (let i = 0; i < list.length; i++) {
      if(+list[i].id > id)
        id = +list[i].id;
    }
    return (id + 1).toString();
  }

  const handleDelete = async () => {
    await AsyncStorage.removeItem("@key" + curId);
    list.splice(curIndex, 1);
    setList(list);
    setBtnState(true);
  }

  const handleMoveUp = () => {
    if (curIndex === 0)
      move = 0;
    else 
      move = curIndex - 1;
    moveItem(curIndex, move);
    setCurIndex(move);
  }

  const handleMoveDown = () => {
    if (curIndex === list.length-1)
      move = list.length-1;
    else 
      move = curIndex + 1;
    moveItem(curIndex, move);
    setCurIndex(move);
  }

  function moveItem(oldIndex, newIndex) {
    let moveObj = list[oldIndex];
    let otherObj = list[newIndex];
    list.splice(oldIndex, 1, otherObj);
    list.splice(newIndex, 1, moveObj);
    let newList = [];
    for (let i=0;i<list.length;i++) {
      newList.push(list[i]);
    }
    setList(newList);
    resetStorage();
  }

  resetStorage = async() => {
    try {
      await AsyncStorage.clear();
      // list.map((item) => AsyncStorage.setItem('@key' + item.id, JSON,stringify(item)));
      for (let i=0;i<list.length;i++) {
        await AsyncStorage.setItem('@key' + list[i].id, JSON.stringify(list[i]));
      }
    } catch (err) {
      console.log(err);
    }
  }

  const renderItem = ({item}) => (
    <ListItem item={item} handleClick={handleClick} />
  )

  return (
  <SafeAreaView style={styles.container}>
    <Header title="Grocery List"/>
      <Modify btnState={btnState} addNewList={addNewList} handleDelete={handleDelete} handleMoveUp={handleMoveUp} handleMoveDown={handleMoveDown}/>
      <FlatList
      data={list}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listItemView: {
      padding:15,
      flexDirection:'row',
      justifyContent: 'space-between',
      alignItems:'center',
      borderBottomColor: 'lightgray',
      borderBottomWidth: 0.5
  },
  highlight: {
      backgroundColor:'#ECF87F',
      padding: 15,
  },
  strikeThrough: {
      fontSize:18,
      textDecorationLine: 'line-through'
  }, 
  none: {
      fontSize:18,
      textDecorationLine: 'none'
  }
})

export default App;