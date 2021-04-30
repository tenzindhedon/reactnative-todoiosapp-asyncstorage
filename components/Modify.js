import React from 'react';
import {View, StyleSheet, TouchableOpacity, Alert, Button} from 'react-native';

const Modify = ({btnState, addNewList, handleDelete, handleMoveUp, handleMoveDown}) => {
  return (
  <View style={styles.btnPanel}>
        <TouchableOpacity style={styles.btn}>
            <Button
                title="Add"
                onPress={()=>Alert.prompt('New List', 'Enter your new list', (text) => addNewList(text))}
            />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
            <Button
                title="Delete"
                disabled = {btnState}
                onPress={handleDelete}
            />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
            <Button
                title="Up"
                disabled = {btnState}
                onPress={handleMoveUp}
            />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
            <Button
                style={styles.btn}
                title="Down"
                disabled = {btnState}
                onPress={handleMoveDown}
            />
        </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
    btnPanel:{
        padding:15,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center'
    },
    btn:{
        backgroundColor:'gold',
        width:80,
        height:40,
        borderRadius:10
    }
});

export default Modify;