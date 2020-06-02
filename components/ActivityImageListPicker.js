import React, { Component, useState } from 'react'
import { Text, View, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native'
var imageList = [{ uri: require('../components/icon/pngs/swathing.png') },]

const ActivityImageListPicker = () => {
    const [images, setImages] = useState([])
    return (
        <ScrollView horizontal={true}>

            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: 'flex-start' }}>

                <View
                    style={{ height: 100, width: 100, margin: 5, backgroundColor: '#eee', justifyContent: "center", alignItems: "center" }}
                >
                    <TouchableOpacity onPress={() => {
                        var length = images.length;
                        if (length > 0) {

                            setImages([...images, {
                                id: images[length - 1].id
                                    + 1, uri: require('../components/icon/pngs/swathing.png')
                            }])
                        }
                        else {
                            setImages([{
                                id: 1, uri: require('../components/icon/pngs/swathing.png')
                            }])
                        }
                    }}>

                        <Image
                            style={{
                                height: 50, width: 50, resizeMode: 'contain'
                            }}
                            source={require('../components/icon/pngs/addicon.png')}
                        />
                    </TouchableOpacity>
                </View>
                <FlatList
                    scrollEnabled={false}
                    data={images}
                    keyExtractor={(item, index) => item.id.toString()}
                    horizontal={true}
                    renderItem={({ item, index }) => (

                        <View
                            style={{ height: 100, width: 100, margin: 5, backgroundColor: '#eee', justifyContent: "center", alignItems: "center" }}
                        >


                            <Image
                                style={{ height: 50, width: 50 }}
                                source={item.uri}

                            />
                            <View style={{
                                height: 15, width: 15, position: 'absolute',
                                right: 5,
                                top: 5, resizeMode: 'contain'
                            }}>
                                <TouchableOpacity onPress={() => {
                                    if (images.length != 1) {
                                        setImages(images.splice(index));
                                    } else {
                                        setImages([])
                                    }
                                }


                                }>
                                    <Image
                                        style={{
                                            height: 15, width: 15, resizeMode: 'contain'
                                        }}
                                        source={require('../components/icon/pngs/close.png')}


                                    />
                                </TouchableOpacity>
                            </View>




                        </View>


                    )

                    }
                />
            </View>
        </ScrollView>
    )
}

export default ActivityImageListPicker
