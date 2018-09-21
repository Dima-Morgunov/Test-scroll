import React, { Component } from "react";
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized";
import "./index.css";



class App extends Component {

    state = {
        searchMessage:{
            text:''
        },
        newMessage:{
            name: ``,
            text:'',

        },
        showChangeInput: null,
        MirrorArray:[],
        data:[],
        index: 0,
        scrollToLastMessage: 0,
        CheckboxValue: true,
        changeMessage:''
    }



    onChengeMessage = e =>{

    }



    scrollToPosition = () =>{
        if(this.scrollToLastMessage === undefined){
            this.setState({
                scrollToLastMessage: this.state.data.length,
                CheckboxValue: true
            })
        }
        if(this.scrollToLastMessage !== undefined){
            this.setState({
                scrollToLastMessage: undefined,
                CheckboxValue: false
            })
        }
    }

    handleChangeChk = () =>{
        this.cache.clearAll()

        this.setState({
            scrollToLastMessage: this.state.data.length,

        })
    }

    ScrollToLastMessage = () => {
            this.setState({
                scrollToLastMessage: this.state.data.length
            })
    }


    onSearch  = e =>{
        var searchQuery = e.target.value.toLowerCase();
        if (e.target.value){
            var messageList = this.state.data.filter(element => {
                var searchValue = element.text.toLowerCase()
                return searchValue.indexOf(searchQuery) !== -1
            })
            console.log( e.target.value)
            this.setState({
                data: messageList
            });
        }
        if(this.state.data.length < this.state.MirrorArray.length) {
            var messageLis = this.state.MirrorArray.filter(element => {
                var searchValu = element.text.toLowerCase()
                return searchValu.indexOf(searchQuery) !== -1
            })
            console.log( e.target.value)
            this.setState({
                data: messageLis
            });
        }

        if(e.target.value === 0){
            this.setState({
                data: this.state.MirrorArray
            })
        }
    }
    createdMessages = () => {

        var list = []
        var MirrorArray = []
        for (let i = 1; i < 10000; i++){
            list.push({
                name: i,
                text: `this is ${i} element`,
                id: i
            })
        }
        for (let i = 1; i < 10000; i++){
            MirrorArray.push({
                name: i,
                text: `this is ${i} element`,
                id: i
            })
        }
        this.setState({
            data: list,
            MirrorArray: list,
            scrollToLastMessage: this.state.data.length
        })

    }
    addNewMessage = () =>{
        /*let newMirrorArray = this.state.MirrorArray*/
        let newMessageArray = this.state.data
        var newMess = this.state.newMessage
        newMess.name = new Date()
        newMessageArray.push(newMess)
        console.log(this.state.data)
        this.setState({
            data: newMessageArray,
            scrollToLastMessage: this.state.data.length
        })
        /* newMirrorArray.push(this.state.newMessage)
         this.setState({
             MirrorArray: newMirrorArray
         })*/
    }
    onChange  = e =>{
        this.setState({
            newMessage: { ...this.state.newMessage, [e.target.name]: e.target.value },
            changeMessage: +e.target.value
        });
    }

    componentDidMount() {
        this.createdMessages()

        this.setState({
            scrollToLastMessage: this.state.data.length
        })
        window.addEventListener('load', this.ScrollToLastMessage);
    }
    chandgeWidth(){
        this.cache.clearAll()
        return this.cache.rowHeight
    }

    constructor(props) {
        super(props);
        this.setScrollIndex = evt => this.setState({index: evt.target.value})
        this.setBodyRef = ref => this.bodyRef = ref
        this.jumpToRow = () => this.bodyRef.scrollToRow(this.state.index)
        var cache = new CellMeasurerCache({
            defaultHeight: 100,
            fixedWidth: true,
        })
        this.cache = cache;
    }

    showChangeMenu = (e) =>{
        console.log(this.state.data[+e.target.value].text)
        this.setState({
            showChangeInput: +e.target.value,
            scrollToLastMessage: +e.target.value,
            changeMessage: this.state.data[+e.target.value].text
        })
        console.log(this.state.showChangeInput)
    }

    renderRow = ({ index, parent, key, style, isScrolling}) => {
        const {data, scrollToLastMessage, changeMessage, showChangeInput} = this.state
        console.log(scrollToLastMessage)
        if(isScrolling && scrollToLastMessage !== undefined) {
            this.setState({
                scrollToLastMessage: undefined,
                CheckboxValue: false
            })
        }

        return (
            <CellMeasurer
                cache={this.cache}
                columnIndex={0}
                key={key}
                parent={parent}
                rowIndex={index}
            >
                <div style={style} className='wrap'>
                    <span className='Row'>{index}: {data[index].text}</span>
                    {showChangeInput === index ?
                        <div>
                            <input
                                className='wrap-input'
                                type="text"
                                placeholder="Сообщение..."
                                name={index}
                                value={changeMessage}
                                onChange={this.onChange}
                            />
                                <button
                                    className='wrap-changeButton'
                                    onClick={this.showChangeMenu}
                                >
                                    изменить
                                </button>
                        </div>
                         :
                        <input
                            type='button'
                            className='wrap-changeButton'
                            onClick={this.showChangeMenu}
                            value={index}
                        />

                    }
                </div>
            </CellMeasurer>
        )

    }
    render() {
        const {newMessage, data, scrollToLastMessage, CheckboxValue} = this.state
        return (
            <AutoSizer>
                {
                    ({ width, height }) => {
                        return <div>
                            <List
                                ref = {this.setBodyRef}
                                deferredMeasurementCache={this.cache}
                                className='List'
                                width={width}
                                height={height}
                                rowCount={data.length}
                                rowHeight={this.chandgeWidth(width)}
                                rowRenderer={this.renderRow}
                                scrollToIndex={scrollToLastMessage}

                            />
                            <div className='user'>
                                <input
                                    type="text"
                                    placeholder="Сообщение..."
                                    name='text'
                                    value={newMessage.text}
                                    onChange={this.onChange}
                                />
                                <button onClick={this.addNewMessage}>push</button>
                                <p>Найти сообщение по тексту</p>
                                <input
                                    type="text"
                                    placeholder="Поиск..."
                                    name='text'
                                    onChange={this.onSearch}

                                />
                                <p>показывать новые сообщения</p>
                                <input
                                    type='checkbox'
                                    defaultChecked={CheckboxValue}
                                    onChange={this.scrollToPosition}
                                />
                            </div>
                        </div>
                    }}
            </AutoSizer>


        );
    }
}

export default App;
