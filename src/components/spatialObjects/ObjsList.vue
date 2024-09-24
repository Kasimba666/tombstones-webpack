<template>
  <div class="ObjsList">
    <div class="objs-cards" v-if="modeList === 'cards'">
      <template v-if="!!rows && rows.length>0">
        <div class="obj-card"
             v-for="(row, r) of rows" :key="r"
             @click="setCurrentRow(row)">
          <div :class="{current: isCurrent(row)}">
          </div>
          <div class="obj-card-title">
            {{ row.name }}
          </div>
          <div class="obj-card-body">
            <template v-if="!!cols && cols.length>0">
              <div class="obj-card-image"
                   v-if="(!!row.imgs && row.imgs.small!='')"
                   :style="{backgroundImage: `url(${row.imgs.small})`}"
              >
              </div>
              <div class="obj-card-attributes">
                <div class="obj-card-attribute"
                     v-for="(title, i) of cols" :key="i"
                >
                  <template v-if="!!arrToString(row[title.attrName] && title.attrName != 'name')">
                    {{ title.titleName }}
                    {{ true ? ': ' : '' }}
                    {{ arrToString(row[title.attrName]) }}
                  </template>
                </div>
              </div>
            </template>

          </div>
        </div>
      </template>

    </div>
    <div class="objs-table" v-if="modeList === 'table'">
      <div class="obj-title">
        <div class="obj-cell title"
             :class="{right: (i === cols.length-1)}"
             :style="{width:  Math.round((title.colSize / sumColSize) * 100) + '%' }"
             v-for="(title, i) of cols" :key="i">
          {{ title.titleName }}
        </div>
      </div>
      <template v-if="!!rows && rows.length>0">
        <div class="obj-row"
             :class="{last: (r === rows.length-1)}"
             v-for="(row, r) of rows" :key="r"
             :style="{backgroundColor: (r%2 === 1) ? 'hsl(0, 0%, 83%, 0.3)' : 'none'}"
             @click="setCurrentRow(row)">
          <div :class="{current: isCurrent(row)}">
          </div>
          <template v-if="!!cols && cols.length>0">
            <div class="obj-cell cell-row"
                 :class="{right: (i === cols.length-1)}"
                 :style="{width:  Math.round((title.colSize / sumColSize) * 100) + '%' }"
                 v-for="(title, i) of cols" :key="i"
            >
              {{ arrToString(row[title.attrName]) }}
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>


</template>

<script>
export default {
  components: {},
  props: {
    // currentRow: Object,
    currentID: String,
    rows: Array,
    cols: Array,
    modeList: String,
  },
  emits: ['clickRow'],
  data() {
    return {}
  },
  computed: {
    sumColSize() {
      if (!!this.cols) {
        return this.cols.reduce((sum, item) => {
          return sum + item.colSize
        }, 0)
      }
    },
  },
  methods: {
    arrToString(arr) {
      let r = '';
      if (Array.isArray(arr)) {
        arr.forEach((item) => {
          r += item.slice(0, 1).toUpperCase() + item.slice(1) + ', '
        });
        r = r.slice(0, -2);
      } else {
        r = arr;
      }
      return r;
    },
    setCurrentRow(row) {
      this.$emit('clickRow', row.id);
    },
    isCurrent(row) {
      return row.id === this.currentID;
    },


  },
  mounted() {
  },
}
</script>

<style lang="scss">
.ObjsList {
  width: 100%;
  //height: 80dvh;
  //overflow-x: scroll;
  .objs-table {
    position: relative;
    width: 100%;
    //width: 2000px;
    height: auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: start;
    border: 1px solid hsla(0, 0%, 50%, 0.8);

  }

  .obj-title {
    position: relative;
    width: 100%;
    height: auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    border-bottom: 1px solid hsla(0, 0%, 50%, 0.6);
    background-color: hsl(0, 0%, 83%, 0.3);

  }

  .obj-row {
    position: relative;
    width: 100%;
    height: auto;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    border-bottom: 1px solid hsla(0, 0%, 50%, 0.6);
    cursor: pointer;
    transition-duration: 0.5s;

    &:hover {
      box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
      transition-duration: 0.5s;
    }

    &.chosen {
      background-color: rgba(0, 140, 186, 0.5);
    }

    &.last {
      border-bottom: none;
    }

  }

  .current {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid rgba(0, 140, 186, 0.5);
  }


  .obj-cell {
    position: relative;
    height: auto;
    display: flex;

    padding: 2px;
    flex: 1 1 auto;

    border-right: 1px solid hsla(0, 0%, 50%, 0.8);

    &.title {
      justify-content: center;
      align-items: center;
      text-align: center;
      word-break: break-word;
      font-weight: bold;
    }

    &.cell-row {
      justify-content: flex-start;
      align-items: flex-start;
      text-align: left;
      word-break: break-all;
    }

    &.right {
      border-right: none;
    }
  }

  .objs-cards {
    position: relative;
    width: 100%;
    height: auto;
    min-width: 50px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 2px;
    flex: 1 1 auto;

    .obj-card {
      position: relative;
      width: 100%;
      height: auto;
      min-width: 50px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 2px;
      flex: 1 1 auto;
      border: 1px solid gray;
      transition-duration: 0.5s;
      //padding: 3px;

      &:hover {
        box-shadow: 0 0 10px 3px rgba(0, 140, 186, 0.5);
        transition-duration: 0.5s;
      }

      &.chosen {
        background-color: rgba(0, 140, 186, 0.5);
      }

      .obj-card-title {
        font-weight: bold;
        background-color: hsla(180, 100%, 25%, 0.1);
        padding: 3px;
      }

      .obj-card-body {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 3px;

        .obj-card-image {
          flex: 1 1 auto;
          width: 80px;
          height: 120px;
          background-color: white;
          border-radius: 2px;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;

        }

        .obj-card-attributes {
          display: flex;
          flex-flow: column wrap;
          justify-content: flex-start;
          align-items: flex-start;
          padding: 3px;

          obj-card-attribute {
            //display: flex;
            //flex-flow: column wrap;
            //justify-content: flex-start;

          }
        }
      }

      .obj-card-element {
        &.title {
          background-color: hsla(180, 100%, 25%, 0.1);
        }
      }

    }

  }
}
</style>
