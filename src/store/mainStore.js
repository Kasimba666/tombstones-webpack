import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import fromFileJSON from "@/data/Epigraphy_2024_3857.json";
import imagePaths from "raw-loader!@/data/images_tombstones.csv";

const smallImgPath = '300px/';
const largeImgPath = 'large/';
export default new Vuex.Store({
    state: {
        scheme: [
            {
                attrName: 'id',
                title: 'id',
                inTable: 1,
                inCards: 1,
                colSize: 0.8,
                inDetails: 1,
                inMap: 1,
                filterType: 'none',
                parentValueFrom: null,
                sortable: 0,
            },
            {
                attrName: 'name',
                title: 'Наименование',
                inTable: 1,
                colSize: 2,
                inCards: 1,
                inDetails: 1,
                inMap: 1,
                filterType: 'input',
                parentValueFrom: null,
                sortable: 1,
            },
            {
                attrName: 'admin',
                title: 'Район',
                inTable: 1,
                colSize: 1.5,
                inCards: 1,
                inDetails: 1,
                inMap: 0,
                filterType: 'select',
                parentValueFrom: null,
                sortable: 1,
            },
            {
                attrName: 'local',
                title: 'Нас.пункт',
                inTable: 1,
                colSize: 1.5,
                inCards: 1,
                inDetails: 1,
                inMap: 0,
                filterType: 'select',
                parentValueFrom: 'admin',
                sortable: 1,
            },
            {
                attrName: 'date',
                title: 'Век',
                inTable: 1,
                colSize: 1,
                inCards: 1,
                inDetails: 1,
                inMap: 1,
                filterType: 'select',
                parentValueFrom: null,
                sortable: 1,
            },
            {
                attrName: 'type',
                title: 'Тип',
                inTable: 1,
                colSize: 1,
                inCards: 1,
                inDetails: 1,
                inMap: 0,
                filterType: 'select',
                parentValueFrom: null,
                sortable: 0,
            },
            {
                attrName: 'sizes',
                composite: {children: ['depth', 'width', 'height'], delimiter: 'x'},
                title: 'ГxШxВ, см',
                inTable: 1,
                colSize: 1,
                inCards: 1,
                inDetails: 1,
                inMap: 0,
                filterType: 'none',
                parentValueFrom: null,
                sortable: 0,
            },
            {
                attrName: 'depth',
                title: 'Глубина',
                inTable: 0,
                colSize: 1,
                inCards: 0,
                inDetails: 0,
                inMap: 0,
                filterType: 'range',
                parentValueFrom: null,
                sortable: 1,
            },
            {
                attrName: 'width',
                title: 'Ширина',
                inTable: 0,
                colSize: 1,
                inCards: 0,
                inDetails: 0,
                inMap: 0,
                filterType: 'range',
                parentValueFrom: null,
                sortable: 1,
            },
            {
                attrName: 'height',
                title: 'Высота',
                inTable: 0,
                colSize: 1,
                inCards: 0,
                inDetails: 0,
                inMap: 0,
                filterType: 'range',
                parentValueFrom: null,
                sortable: 1,
            },
            {
                attrName: 'front',
                title: 'Фронт',
                inTable: 0,
                colSize: 1,
                inCards: 0,
                inDetails: 1,
                inMap: 0,
                filterType: 'select',
                parentValueFrom: null,
                sortable: 0,
            },
            {
                attrName: 'whole',
                title: 'Полный',
                inTable: 1,
                colSize: 1,
                inCards: 0,
                inDetails: 1,
                inMap: 0,
                filterType: 'select',
                parentValueFrom: null,
                sortable: 0,
            },
            {
                attrName: 'place',
                title: 'Место',
                inTable: 1,
                colSize: 1,
                inCards: 0,
                inDetails: 1,
                inMap: 0,
                filterType: 'select',
                parentValueFrom: null,
                sortable: 0,
            },
            {
                attrName: 'position',
                title: 'Положение',
                inTable: 1,
                colSize: 1,
                inCards: 0,
                inDetails: 1,
                inMap: 0,
                filterType: 'select',
                parentValueFrom: null,
                sortable: 0,
            },
            {
                attrName: 'year',
                title: 'Год',
                inTable: 1,
                colSize: 1,
                inCards: 1,
                inDetails: 1,
                inMap: 1,
                filterType: 'none',
                parentValueFrom: null,
                sortable: 0,
            },
            {
                attrName: 'person',
                title: 'Персона',
                inTable: 0,
                colSize: 0,
                inCards: 1,
                inDetails: 1,
                inMap: 1,
                filterType: 'none',
                parentValueFrom: null,
                sortable: 0,
            },
            {
                attrName: 'sketchfab',
                title: '3d',
                inTable: 0,
                colSize: 0,
                inCards: 0,
                inDetails: 1,
                inMap: 0,
                filterType: 'none',
                parentValueFrom: null,
                sortable: 0,
            },
            {
                attrName: 'coordinates',
                title: 'Координаты',
                inTable: 0,
                colSize: 1,
                inCards: 0,
                inDetails: 1,
                inMap: 0,
                filterType: 'none',
                parentValueFrom: null,
                sortable: 0,
            },
        ],
        geojson: null,
        imgs: [],
        filtersValues: [],
        sortingValues: {attrName: 'name', direction: 'asc'},
        currentID: null,
    },
    getters: {
        //фильтры построены на основе схемы, справочники для фильтров берутся из полного набора данных соответствующего раздела схемы
        filters: (state) => {
            if (!!state.geojson) {
                let newFilters = [];
                state.scheme.forEach((attr) => {
                    if (!state.geojson.features[0].properties.hasOwnProperty(attr.attrName)) {
                        console.log(attr.attrName);
                        return
                    };
                    if (attr.filterType === 'input') {
                        newFilters.push({
                            attrName: attr.attrName,
                            title: attr.title,
                            type: 'input',
                        });
                    }
                    if (attr.filterType === 'select') {
                        let listValues = [];
                        state.geojson.features.forEach(feature => {
                            if (feature.properties[attr.attrName] != null && feature.properties[attr.attrName] != '' && !listValues.map((v) => {
                                return v.value
                            }).includes(feature.properties[attr.attrName])) {
                                let newParentValue = null;
                                if (attr.parentValueFrom != null) {
                                    if (feature.properties[attr.parentValueFrom] != null && feature.properties[attr.parentValueFrom] != '') {
                                        newParentValue = feature.properties[attr.parentValueFrom];
                                    }
                                }

                                listValues.push({
                                    value: feature.properties[attr.attrName],
                                    parentValue: newParentValue
                                });
                            }
                        });
                        newFilters.push({
                            attrName: attr.attrName,
                            attrParent: attr.parentValueFrom,
                            title: attr.title,
                            type: 'select',
                            listValues: listValues.sort()
                        });
                    }//select
                    if (attr.filterType === 'range') {
                        let listValues = [];
                        let allValues=[];
                        state.geojson.features.forEach((feature)=>{
                            let value=feature.properties[attr.attrName];
                            if (!!value) allValues.push(value);
                        });
                        listValues.push(Math.min(...allValues));
                        listValues.push(Math.max(...allValues));
                        newFilters.push({
                            attrName: attr.attrName,
                            title: attr.title,
                            type: 'range',
                            listValues: listValues
                        });
                    }
                });
                return newFilters;
            }
        },
        filteredGeojson: (state) => {//на основе значений фильтров
            if (!!state.geojson) {
                let newFeatures = [];
                state.geojson.features.forEach((item) => {
                    //проверить item на соответствие значениям фильтров
                    let filterPass = true;
                    state.filtersValues.forEach((fV) => {
                        if (fV.type === 'select') {
                            if (!((fV.value === item.properties[fV.attrName]) || (fV.value === 'all'))) filterPass = false;
                        }
//                         if (fV.type === 'range') {
//                             if (!(!fV.value || (fV.value?.[0] <= item.properties[fV.attrName]) && (item.properties[fV.attrName] <= fV.value?.[1]))) filterPass = false;
//                         }
                        if (fV.type === 'input') {
                            if (!((fV.value === null) || (fV.value === '') ||
                                ((item.properties[fV.attrName] !== null ? item.properties[fV.attrName] : '').toString().toLowerCase().includes((fV.value !== null ? fV.value : '').toString().toLowerCase(), 0)))
) filterPass = false;
                        }

                    });
                    //сформировать отфильтрованный geojson
                    if (filterPass) {
                        newFeatures.push({
                            type: item.type,
                            properties: item.properties,
                            geometry: item.geometry,
                        });
                    }
                })
                return {
                    type: state.geojson.type,
                    name: state.geojson.name,
                    crs: state.geojson.crs,
                    features: newFeatures.sort((a, b) => (state.sortingValues['direction'] === 'asc' ? 1: -1) * (a.properties[state.sortingValues['attrName']] > b.properties[state.sortingValues['attrName']] ? 1: -1)),
                    // features: newFeatures.sort((a, b) => a.properties[state.sortingValues['attrName']].localeCompare(b.properties[state.sortingValues['attrName']])),
                }
            }
        },
        filteredImagesCards: (state, getters) => {
            let IDs = getters.filteredGeojson?.features.map(v => v.properties.id.toString());
            return state.imgs.filter(v => IDs.includes(v.id) && v['category'] === 'cards').map((v) => {
                return {
                    id: v.id,
                    img: {
                        small: require(`@/assets/img/${v['path']}/${smallImgPath}${v['filename']}`),
                        large: require(`@/assets/img/${v['path']}/${largeImgPath}${v['filename']}`),
                    }
                }
            });
        },
        detailsImgsByCategoriesByID: (state) => (id) => {
            if (!!state.imgs && state.imgs.length > 0) {
                let imgsObj = state.imgs.filter(v=>''+v.id === ''+id);
                return [...new Set(imgsObj.map(v => {
                    return v['category']
                }))]
                    .map((v) => {
                        return {
                            category: v, categoryTitle: imgsObj.filter((w) => {
                                if (w['category'] === v) {
                                    return w
                                }
                            })[0]['category_title'], imgs: imgsObj.filter((w) => {
                                if (w['category'] === v) {
                                    return w
                                }
                            }).sort((a, b) => {
                                return (a['order'] > b['order']) ? 1 : -1
                            }).map((s) => {
                                return {
                                    label: s['caption'],
                                    small: require(`@/assets/img/${s['path']}/${smallImgPath}${s['filename']}`),
                                    large: require(`@/assets/img/${s['path']}/${largeImgPath}${s['filename']}`)

                                }
                            })
                        }
                    })
            } else {
                return null
            }
        },
        detailsGeojsonByID: (state) => (id) => {
            let tempDetails = [];
            let findedFeature = state.geojson?.features.find(v => '' + v.properties.id === '' + id);
            if (!findedFeature) return null;
            state.scheme.forEach((item) => {
                if (item.inDetails === 1) {
                    if (item.hasOwnProperty('composite')) {
                        let result = [];
                        item.composite.children.forEach(v=> {if (!!findedFeature.properties[v])
                            result.push(findedFeature.properties[v])
                        });

                        tempDetails.push({
                            attrName: item.attrName,
                            titleName: item.title,
                            value: result.join(item.composite.delimiter)
                        });
                    } else {
                        tempDetails.push({
                            attrName: item.attrName,
                            titleName: item.title,
                            value: findedFeature.properties[item.attrName]
                        });
                    }
                }
            });
            return tempDetails
        },
        currentFeature(state, getters) {
            if (!state.currentID || !getters.filteredGeojson.features || getters.filteredGeojson.features.length === 0 || !getters.filteredGeojson.features[0]) return null;

            let newFeature = getters.filteredGeojson.features.find(v => ''+v.properties.id.toString() === state.currentID.toString());
            if (!!newFeature) {
                return {
                    type: getters.filteredGeojson.type,
                    name: getters.filteredGeojson.name,
                    crs: getters.filteredGeojson.crs,
                    features: [getters.filteredGeojson.features.find(v => v.properties.id.toString() === state.currentID.toString())],
                }
            } else {
                return null
            }
        },
        oneFeatureForMaps(state, getters) {
            if (!!getters.currentFeature) {
                let newProperties = {};
                state.scheme.forEach((item) => {
                    if (item.inMap === 1) {
                        newProperties[item.attrName] = getters.currentFeature.features[0].properties[item.attrName];
                    }
                });
                return {
                    type: getters.currentFeature.type,
                    name: getters.currentFeature.name,
                    crs: getters.currentFeature.crs,
                    features: [{
                        type: getters.currentFeature.features[0].type,
                        properties: newProperties,
                        geometry: getters.currentFeature.features[0].geometry,
                    }],
                }
            } else return null
        },
        collectionFeaturesForMaps(state, getters) {
            if (!!getters.filteredGeojson && !!getters.filteredGeojson.features) {
                let newFeatures = getters.filteredGeojson.features.map((feature) => {
                    let newProperties = {};
                    state.scheme.forEach((item) => {
                        if (item.inMap === 1) {
                            newProperties[item.attrName] = feature.properties[item.attrName];
                        }
                    });
                    return {
                        type: feature.type,
                        properties: newProperties,
                        geometry: feature.geometry,
                    }
                });
                return {
                    type: getters.filteredGeojson.type,
                    name: getters.filteredGeojson.name,
                    crs: getters.filteredGeojson.crs,
                    features: newFeatures,
                    // features: !!getters.oneFeatureForMaps ? newFeatures.filter(v=>v.properties.id !== getters.oneFeatureForMaps.features?.[0].properties?.id) : newFeatures,
                }
            }
        },

        URLQuery(state) {
            let query = {};
            state.filtersValues.forEach((v)=>{if (!!v.value) query[v.attrName] = v.value});
            query['sort'] = [];
            query['sort'].push(state.sortingValues.attrName);
            query['sort'].push(state.sortingValues.direction);
            return query;
        },

},
    mutations: {
        setGeojson(state, v) {
            state.geojson = v
        },
        setImgs(state, v) {
            state.imgs = v
        },
        setFiltersValues(state, v) {
            state.filtersValues = v;
        },
        setSortingValues(state, v) {
            // state.sortingValues = v;
            setTimeout(()=>state.sortingValues = v, 50);

        },
        setCurrentID(state, v) {
            state.currentID = v;
        },
        setFromURLQuery(state, getters, query) {
            if (!!query && Object.keys(query).length>0) {
                state.filtersValues.forEach((v) => {if (query.hasOwnProperty(v.attrName)) v.value = query[v.attrName]});
                console.log(query, query.sortAttrName, query.sortDirection);
                state.sortingValues.attrName = query.sort[0];
                state.sortingValues.direction = query.sort[1];

            } else {
                //если нет query, то ставим исходные значения
                if (Object.keys(state.sortingValues).length===0) state.sortingValues = {attrName: 'name', direction: 'asc'};

            }
        },

    },
    actions: {
        loadObjsStore({commit}) {
            try {
                let newGeojson = fromFileJSON;
                // привести все имена атрибутов объекта properties к lower case
                newGeojson.features = newGeojson.features.map((v) => {
                    return {
                        type: v.type,
                        properties: Object.fromEntries(Object.entries(v.properties).map(([key, value]) => {
                            return [key.toLowerCase(), value]
                        })),
                        geometry: v.geometry,
                    }
                });
                commit('setGeojson', newGeojson);
            } catch (e) {
                alert('Ошибка загрузки файла');
            }

        },
        loadImagesCSV({commit}) {
            let lines = imagePaths.split(/\r\n|\r|\n/g);
            if (lines.length > 1) {
                let newImgs = [];
                let titles = lines.shift().split(';');
                lines.forEach((v) => {
                    let img = {};
                    if (v.replaceAll(' ', '') != '') {
                        let line = v.split(';');
                        for (let i = 0; i < line.length; i++) {
                            img[titles[i].toLowerCase()] = line[i];
                        }
                        newImgs.push(img);
                    }
                });
                commit('setImgs', newImgs);
            }
        },
        initFiltersValues({state, commit, getters}) {
            if (!!getters.filters && state.filtersValues.length===0) {
                // commit('setFiltersValues', getters.filters.map((item) => {return {attrName: item.attrName, type: item.type, value: 'all'}}));
                commit('setFiltersValues', getters.filters.map((item) => {return {attrName: item.attrName, type: item.type, value: item.type==='range' ? [] : null}}));
            }

        },
        initSortingValues({state, commit}) {
            if (Object.keys(state.sortingValues).length===0) commit('setSortingValues', {attrName: 'name', direction: 'asc'});
        },
    },
    modules: {},
    plugins: [createPersistedState({key: 'spatialObjs', paths: ['filtersValues', 'sortingValues']})],
    namespaced: true,
})
