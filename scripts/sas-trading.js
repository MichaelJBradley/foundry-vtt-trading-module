/**
 * SasId is a unique ID for a trade good.
 * @typedef {string} SasGoodId
 */

/**
 * SasGoodName is the name of a trade good.
 * @typedef {string} SasGoodName
 */

/**
 * SasCityName is the name of a city.
 * @typedef {string} SasCityName
 */

/**
 * SasDemand is a level of the Demand enum.
 * @typedef {string} SasDemand
 */

/**
 * SasScarcity is an level of the Scarcity enum.
 * @typedef {string} SasScarcity
 */

/**
 * SasGood is a single trade good for one city.
 * 
 * Corresponds to the GOODS setting.
 * @typedef {Object} SasGood
 * @property {SasGoodId} id
 * @property {SasGoodName} name
 * @property {SasCityName} city
 * @property {SasDemand} demand
 * @property {SasScarcity} scarcity
 */

/**
 * SasGoods is a mapping of good IDs to trade goods.
 * @typedef {{SasGoodId: SasGood}} SasGoods
 */

/**
 * SasBaseGoods is a mapping of trade goods to their values.
 * 
 * Corresponds to the BASE_GOODS setting.
 * @typedef {{SasGoodName: number}} SasBaseGoods
 */

/**
 * SasCities is a list of city names.
 * 
 * Corresponds to the CITIES setting.
 * @typedef {Array<SasCityName>} SasCities
 */

class SasTrading {
    static ID = 'foundry-vtt-trading-module'
    static LANG = 'SAS-TRADING'
    static FLAGS = {}
    static TEMPLATES = {
        CONFIG_GOODS: `modules/${this.ID}/templates/sas-goods-config.hbs`,
        CONFIG_BASE: `modules/${this.ID}/templates/sas-base-goods-config.hbs`,
        CONFIG_CITIES: `modules/${this.ID}/templates/sas-cities-config.hbs`,
        MENU: `modules/${this.ID}/templates/sas-trading-menu.hbs`,
        PARTIALS: {
            MENU_OVERVIEW: `modules/${this.ID}/templates/sas-trading-menu-overview.hbs`,
            MENU_GATHER_INFO: `modules/${this.ID}/templates/sas-trading-menu-gather-info.hbs`,
            MENU_BUY_SELL: `modules/${this.ID}/templates/sas-trading-menu-buy-sell.hbs`
        },
        CHAT: {
            GATHER_INFO: `modules/${this.ID}/templates/sas-chat-gather-info-result.hbs`
        }
    }
    static SETTINGS = {
        GOODS: 'goods',           // see {SasGoods}
        BASE_GOODS: 'base-goods', // see {SasBaseGood}
        CITIES: 'cities',         // see {SasCities}
        // Lang refs
        CONFIG: 'config',
        CONFIG_GOODS: 'goods-menu',
        CONFIG_BASE: 'base-goods-menu',
        CONFIG_CITIES: 'cities-menu',
        NOTIFICATIONS: 'notifications'
    }
    static CONTROLS = {
        TOOLS: 'tools',
        TOOLS_BUTTON: 'tool-button'
    }
    static MENU = {
        TRADE: 'trade-menu',
        TRADE_OVERVIEW: 'overview',
        TRADE_GATHER_INFO: 'gather-info',
        TRADE_BUY_SELL: 'buy-sell',
        NOTIFICATIONS: 'notifications'
    }
    static GM_ROLE = 4

    /**
     * log to console prefixed with ID.
     * 
     * If force is false, it will only log if the Developer Mode module is
     * installed, and the debug flag for this module is enabled.
     * 
     * @param {boolean} force 
     * @param  {...any} args 
     */
    static log(force, ...args) {
        try {
            const debugEnabled = game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID)
        
            if (force || debugEnabled) {
                console.log(this.ID, '|', ...args)
            }
        } catch (e) { }
    }

    /**
     * log an error to the console prefixed with ID.
     * 
     * @param  {...any} args 
     */
    static warn(force, ...args) {
        console.warn(this.ID, '|', ...args)
    }

    /**
     * log an error to the console prefixed with ID.
     * 
     * @param  {...any} args 
     */
    static error(...args) {
        console.error(this.ID, '|', ...args)
    }

    static registerSettings() {
        game.settings.register(this.ID, this.SETTINGS.GOODS, {
            scope: 'world',
            config: false,
            type: Object,
            default: {}
        })
        game.settings.register(this.ID, this.SETTINGS.BASE_GOODS, {
            scope: 'world',
            config: false,
            type: Object,
            default: {}
        })
        game.settings.register(this.ID, this.SETTINGS.CITIES, {
            scope: 'world',
            config: false,
            type: Object,
            default: []
        })
        game.settings.registerMenu(this.ID, this.SETTINGS.CONFIG_BASE, {
            name: `${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_BASE}.name`,
            label: `${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_BASE}.label`,
            hint: `${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_BASE}.hint`,
            icon: 'fas fa-bars',
            type: SasTradingBaseGoodConfig,
            restricted: true
        })
        game.settings.registerMenu(this.ID, this.SETTINGS.CONFIG_CITIES, {
            name: `${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_CITIES}.name`,
            label: `${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_CITIES}.label`,
            hint: `${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_CITIES}.hint`,
            icon: 'fas fa-bars',
            type: SasTradingCitiesConfig,
            restricted: true
        })
        game.settings.registerMenu(this.ID, this.SETTINGS.CONFIG_GOODS, {
            name: `${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_GOODS}.name`,
            label: `${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_GOODS}.label`,
            hint: `${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_GOODS}.hint`,
            icon: 'fas fa-bars',
            type: SasTradingGoodConfig,
            restricted: true
        })
    }

    /**
     * getSettings is a helper to retrieve a setting with this module's ID.
     * @param {string} settingName 
     * @returns {(SasGoods|SasBaseGoods|SasCities)} See SETTINGS for more info.
     */
    static getSetting(settingName) {
        return game.settings.get(this.ID, settingName)
    }

    /**
     * setSetting is a helper to store a setting with this module's ID.
     * @param {string} settingName 
     * @param {(SasGoods|SasBaseGoods|SasCities)} data See SETTINGS for typedefs
     */
    static async setSetting(settingName, data) {
        return game.settings.set(this.ID, settingName, data)
    }

    /**
     * localize is a helper to call Foundry's built in i18n localization
     * function.
     * @param {string} languageKey 
     * @returns The localized string
     */
    static localize(languageKey) {
        return game.i18n.localize(languageKey)
    }


    /**
     * randomProperty returns the entry of a random property for the given
     * object.
     * 
     * @param {{any: any}} obj 
     * @returns {[any, any]} The entry of the random property [key, value].
     */
    static randomProperty(obj) {
        const keys = Object.keys(obj)
        const exclusiveMax = keys.length
        const randIndex = Math.floor(Math.random() * exclusiveMax)
        return [
            keys[randIndex],
            obj[keys[randIndex]]
        ]
    }

    static initialize() {
        this.registerSettings()
        this.tradingMenu = new SasTradingMenu()

        Handlebars.registerHelper('capitalize', (context, options) => {
            return new Handlebars.SafeString(context.charAt(0).toUpperCase() + context.slice(1))
        })

        // Handlebars partials need to be loaded in ahead of time to
        //   1. Tell foundry to load them
        //   2. Register them as partials with Handlebars
        loadTemplates([
            SasTrading.TEMPLATES.PARTIALS.MENU_OVERVIEW, 
            SasTrading.TEMPLATES.PARTIALS.MENU_GATHER_INFO,
            SasTrading.TEMPLATES.PARTIALS.MENU_BUY_SELL
        ])
        
        // Set up the tool button to open the trading menu
        Hooks.on('getSceneControlButtons', buttons => {
            if (game.users.current.role !== SasTrading.GM_ROLE) {
                return
            }
            const noteButtons = buttons.filter(button => button.name === 'notes')
            if (!noteButtons || noteButtons.length === 0) {
                SasTrading.error('could not find the notes control button')
                return
            }
            const noteButton = noteButtons[0]
            const tradingToolButton = {
                button: true,
                icon: "fa-solid fa-sack-dollar",
                name: SasTrading.ID,
                onClick: () => SasTrading.tradingMenu.render(true),
                title: `${SasTrading.LANG}.controls.${SasTrading.CONTROLS.TOOLS}.${SasTrading.CONTROLS.TOOLS_BUTTON}`,
                visible: true
            }
            noteButton.tools.push(tradingToolButton)
        })
    }
}

class SasTradingGoodData {
    /**
     * demand is an enum representing the different demand levels of trade goods.
     * @see {SasDemand}
     */
    static demand = Object.freeze({
        HIGH: 'high',
        AVG: 'avg',
        LOW: 'low'
    })

    /**
     * scarcity is an enum representing the different scarcity levels of trade
     * goods.
     * @see {SasScarcity}
     */
    static scarcity = Object.freeze({
        RARE: 'rare',
        COMMON: 'common',
        ABUNDANT: 'abundant'
    })

    /**
     * goodId generates an ID for the combination of good and city.
     * @param {SasGoodName} goodName The name of the trade good
     * @param {string} city The city for the trade good
     * @returns {SasGoodId}
     */
    static goodId(goodName, city) {
        return `${goodName}#${city}`
    }

    /**
     * createGood adds a good to the DB indexed by the ID.
     * 
     * If good.id is left undefined, it will be generated by createGood.
     * If a good with this ID already exists, it does nothing.
     * The bare minimum to define a new good is name and city.
     * @param {SasGood} good 
     */
    static createGood(good) {
        if (!good.name || !good.city) {
            SasTrading.error('good must have at least name and city properties', good)
            return
        }
        if (!good.id) {
            good.id = this.goodId(good.name, good.city)
        } else if (good.id !== this.goodId(good.name, good.city)) {
            SasTrading.error(false, 'good.id "', good.id, '" does not match expected id:', this.goodId(good.name, good.city))
            return
        }

        const goods = this.allGoods
        if (goods.hasOwnProperty(good.id)) {
            SasTrading.warn(true, 'good already exists:', good.id)
            ui.notifications.warn(SasTrading.localize(`${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_GOODS}.${SasTrading.SETTINGS.NOTIFICATIONS}.already-exists`))
            return
        }

        goods[good.id] = good
        return SasTrading.setSetting(SasTrading.SETTINGS.GOODS, goods)
    }

    /**
     * createGoods adds any nonexistent goods from the provided array.
     * 
     * If good.id is left undefined, it will be generated and filled in.
     * If a good already exists, it will be ignored. This does not prevent
     * other, nonexistent goods from being created.
     * @param {Array<SasGood>} goods 
     */
    static createGoods(goods) {
        const goodsData = Object.fromEntries(goods.map(good => {
            if (!good.name || !good.city) {
                SasTrading.error(false, 'good must have at least name and city properties', good)
                return
            }
            if (!good.id) {
                good.id = this.goodId(good.name, good.city)
            } else if (good.id !== this.goodId(good.name, good.city)) {
                SasTrading.error(false, 'good.id "', good.id, '" does not match expected id:', this.goodId(good.name, good.city))
                return
            }

            return [good.id, good]
        }))
        // Don't overwrite any existing goods with the same IDs, only add new ones
        const existingGoods = this.allGoods
        const updatedGoods = foundry.utils.mergeObject(existingGoods, goodsData, {overwrite: false})
        return SasTrading.setSetting(SasTrading.SETTINGS.GOODS, updatedGoods)
    }

    /**
     * updateGood updates an existing good by ID.
     * 
     * This merges the existing good with the provided good.
     * If good.id is provided, it must match the provided ID and be the
     * resulting ID for the name and city.
     * @param {SasGoodId} id 
     * @param {SasGood} good 
     */
    static updateGood(id, good) {
        // Validate the provided good.id is correct
        if (good.id && good.id !== id) {
            SasTrading.error('good.id does not match id:', id, good)
            return
        }
        // If good name and city are provided, they must result in the same ID
        if ((good.name && good.city) && id !== this.goodId(good.name, good.city)) {
            SasTrading.error('provided good name and city do not match id:', id, good)
            return
        }
        const goods = this.allGoods
        if (!goods.hasOwnProperty(id)) {
            SasTrading.error('good does not exist:', id)
            // TODO: Application warning? Error?
            return
        }
        // Name and city can never change
        if (good.name && good.name !== goods[id].name) {
            SasTrading.error('cannot change name:', 'provided:', good, 'existing:', goods[id])
            return
        }
        if (good.city && good.city !== goods[id].city) {
            SasTrading.error('cannot change city:', 'provided:', good, 'existing:', goods[id])
            return
        }

        const updatedGood = foundry.utils.mergeObject(goods[id], good)
        goods[id] = updatedGood
        return SasTrading.setSetting(SasTrading.SETTINGS.GOODS, goods)
    }

    /**
     * updateGoods updates multiple goods at once.
     * 
     * It performs no error checking, and is expected to be only ever be called
     * from SasTradingGoodConfig#_updateObject.
     * @param {SasGoods} updateData 
     */
    static updateGoods(updateData) {
        const updatedGoods = foundry.utils.mergeObject(this.allGoods, updateData)
        SasTrading.setSetting(SasTrading.SETTINGS.GOODS, updatedGoods)
    }

    /**
     * deleteGood deletes a good by ID
     * @param {SasGoodId} id
     */
    static deleteGood(id) {
        const goods = this.allGoods
        if (!goods.hasOwnProperty(id)) {
            SasTrading.error('good does not exist:', id)
            // TODO: Application warning? Error?
            return
        }
        const updatedGoods = foundry.utils.mergeObject(goods, {[`-=${id}`]: null}, {performDeletions: true})
        return SasTrading.setSetting(SasTrading.SETTINGS.GOODS, updatedGoods)
    }

    /**
     * Get all goods mapped by id.
     * @returns {SasGoods}
     */
    static get allGoods() {
        return SasTrading.getSetting(SasTrading.SETTINGS.GOODS)
    }

    /**
     * Get all goods mapped by city.
     * @returns {{SasCityName: {SasGoodName: SasGood}}}
     */
    static get goodsByCity() {
        const goods = this.allGoods
        const cityGoods = {}
        Object.entries(goods).forEach(([_, good]) => {
            const city = good.city
            if (!cityGoods.hasOwnProperty(city)) {
                cityGoods[city] = {}
            }
            cityGoods[city][good.name] = good
        })
        return cityGoods
    }

    /**
     * Get all goods mapped by name.
     * @returns {{SasGoodName: {SasCityName: SasGood}}}
     */
    static get goodsByName() {
        const goods = this.allGoods
        const namedGoods = {}
        Object.entries(goods).forEach(([_, good]) => {
            const name = good.name
            if (!namedGoods.hasOwnProperty(name)) {
                namedGoods[name] = {}
            }
            namedGoods[name][good.city] = good
        })
        return namedGoods
    }

    /**
     * getGood is a convenience function to get a good by ID.
     * @param {SasGoodId} id 
     * @returns {SasGood}
     */
    static getGood(id) {
        const goods = this.allGoods
        if (!goods.hasOwnProperty(id)) {
            SasTrading.error('good with does not exist with id:', id)
            return
        }
        return goods[id]
    }
}

class SasTradingBaseGoodData {

    /**
     * createBaseGood adds a new trade good with its base value.
     * @param {SasGoodName} goodName 
     * @param {number} baseValue 
     */
    static createBaseGood(goodName, baseValue) {
        const baseGoods = this.allBaseGoods
        if (baseGoods.hasOwnProperty(goodName)) {
            SasTrading.warn(true, 'base good already exists:', goodName)
            ui.notifications.warn(SasTrading.localize(`${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_BASE}.${SasTrading.SETTINGS.NOTIFICATIONS}.already-exists`))
            return
        }

        baseGoods[goodName] = baseValue
        return SasTrading.setSetting(SasTrading.SETTINGS.BASE_GOODS, baseGoods)
    }

    /**
     * updateBaseGood updates the base value of a trade good.
     * @param {SasGoodName} goodName 
     * @param {number} baseValue 
     */
    static updateBaseGood(goodName, baseValue) {
        const baseGoods = this.allBaseGoods
        if (!baseGoods.hasOwnProperty(goodName)) {
            SasTrading.error('base good does not exist with name:', goodName)
            return
        }

        baseGoods[goodName] = baseValue
        return SasTrading.setSetting(SasTrading.SETTINGS.BASE_GOODS, baseGoods)
    }

    /**
     * updateBaseGoods updates multiple base goods at once.
     * 
     * It performs no error checking, and is expected to be only ever be called
     * from SasTradingBaseGoodConfig#_updateObject.
     * @param {SasBaseGoods} baseGoods 
     */
    static updateBaseGoods(baseGoods) {
        const updatedBaseGoods = foundry.utils.mergeObject(this.allBaseGoods, baseGoods)
        return SasTrading.setSetting(SasTrading.SETTINGS.BASE_GOODS, updatedBaseGoods)
    }

    /**
     * deleteBaseGood deletes a trade good from the base value list.
     * @param {SasGoodName} goodName 
     * @returns 
     */
    static deleteBaseGood(goodName) {
        const baseGoods = this.allBaseGoods
        if (!baseGoods.hasOwnProperty(goodName)) {
            SasTrading.error('base good does not exist with name:', goodName)
            return
        }

        const updatedBaseGoods = foundry.utils.mergeObject(baseGoods, {[`-=${goodName}`]: null}, {performDeletions: true})
        return SasTrading.setSetting(SasTrading.SETTINGS.BASE_GOODS, updatedBaseGoods)
    }

    /**
     * getBaseGood gets the base value of a trade good.
     * @param {SasGoodName} goodName 
     * @returns {number}
     */
    static getBaseGood(goodName) {
        const baseGoods = this.allBaseGoods
        if (!baseGoods.hasOwnProperty(goodName)) {
            SasTrading.error('base good does not exist with name:', goodName)
            return
        }
        return baseGoods[goodName]
    }

    /**
     * Get all trade goods' base values, keyed by good name.
     * @returns {SasBaseGoods}
     */
    static get allBaseGoods() {
        return SasTrading.getSetting(SasTrading.SETTINGS.BASE_GOODS)
    }

    /**
     * Get all trade goods' base values as an array of objects.
     * @returns {Array<{name: SasGoodName, value: number}>}
     */
    static get allBaseGoodsList() {
        return Object.entries(this.allBaseGoods).map(([name, value]) => {
            return { name: name, value: value }
        })
    }
}

class SasTradingCitiesData {
    /**
     * createCity adds a new city to the list.
     * 
     * If a city already exists, it does nothing.
     * @param {SasCityName} cityName 
     */
    static createCity(cityName) {
        const cities = this.allCities
        if (cities.includes(cityName)) {
            SasTrading.warn(true, 'city already exists:', cityName)
            ui.notifications.warn(SasTrading.localize(`${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_BASE}.${SasTrading.SETTINGS.NOTIFICATIONS}.already-exists`))
            return
        }

        cities.push(cityName)
        return SasTrading.setSetting(SasTrading.SETTINGS.CITIES, cities)
    }

    static deleteCity(cityName) {
        const cities = this.allCities
        if (!cities.includes(cityName)) {
            SasTrading.error('city does not exist with name:', cityName)
            return
        }

        const updatedCities = cities.filter(city => city !== cityName )
        return SasTrading.setSetting(SasTrading.SETTINGS.CITIES, updatedCities)
    }

    /**
     * Get a list of all cities.
     * @returns {SasCities}
     */
    static get allCities() {
        return SasTrading.getSetting(SasTrading.SETTINGS.CITIES)
    }

    /**
     * Get a list of all cities sorted in alphabetical order.
     */
    static get allCitiesSorted() {
        return this.allCities.sort()
    }
}

class SasTradingGoodConfig extends FormApplication {
    static get defaultOptions() {
        const defaults = super.defaultOptions

        const overrides = {
            height: 'auto',
            width: '500',
            id: 'sas-trading-good-config',
            title: SasTrading.localize(`${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_GOODS}.title`),
            template: SasTrading.TEMPLATES.CONFIG_GOODS,
            closeOnSubmit: false,
            submitOnChange: true,
            resizable: true,
            scrollY: ['[save-scroll-existing=true]', '[save-scroll-new=true]'],
            selectedCity: SasTradingCitiesData.allCitiesSorted[0],
            newGoods: {},
        }
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides)

        return mergedOptions
    }

    getData(options) {
        const goodsByCity = SasTradingGoodData.goodsByCity[options.selectedCity] || {}
        const numGoods = Object.keys(goodsByCity).length
        return {
            goodsByCity: goodsByCity,
            numGoods: numGoods,
            cities: SasTradingCitiesData.allCities,
            selectedCity: options.selectedCity,
            demands: Object.values(SasTradingGoodData.demand),
            scarcities: Object.values(SasTradingGoodData.scarcity),
            newGoods: options.newGoods
        }
    }

    async _updateObject(event, formData) {
        const expandedData = foundry.utils.expandObject(formData)

        // 1. Update existing goods data
        // No need to update if there aren't any existing goods or the existing is empty for some reason
        if (!expandedData.existing || Object.keys(expandedData.existing).length === 0) {
            SasTrading.log(false, 'form data for existing trade goods was empty', expandedData)
        } else {
            await SasTradingGoodData.updateGoods(expandedData.existing)
        }

        // 2. Copy new goods fields
        if (!expandedData.new || Object.keys(expandedData.new).length === 0) {
            SasTrading.log(false, 'form data for new trade goods was empty', expandedData)
        } else {
            this.options.newGoods = foundry.utils.mergeObject(this.options.newGoods, expandedData.new)
        }

        // 3. Update selected city
        this.options.selectedCity = expandedData.selectedCity

        this.render()
    }

    activateListeners(html) {
        super.activateListeners(html)
        html.on('click', '[data-action]', this._handleButtonClick.bind(this))
    }

    async _handleButtonClick(event) {
        const clickedElement = $(event.currentTarget)
        const action = clickedElement.data().action
        const goodId = clickedElement.parents('[data-good-id]')?.data()?.goodId

        switch (action) {
            case 'create':
                // A new good will be converted into SasGood, once the confirm-create action is clicked.
                // Until then, a random ID can be used to handle new goods.
                const newGoodId = foundry.utils.randomID(16)
                this.options.newGoods[newGoodId] = {id: newGoodId}
                this.render()
                break
            case 'auto-create':
                const autoCreateSelectedCity = this.options.selectedCity
                const autoCreatedGoods = SasTradingBaseGoodData.allBaseGoodsList.map(baseGood => {
                    return {
                        name: baseGood.name,
                        city: autoCreateSelectedCity,
                    }
                })
                SasTradingGoodData.createGoods(autoCreatedGoods)
                this.render()
                break
            case 'delete':
                const confirmed = await Dialog.confirm({
                    title: SasTrading.localize(`${SasTrading.LANG}.confirms.delete-confirm-good.title`),
                    content: SasTrading.localize(`${SasTrading.LANG}.confirms.delete-confirm-good.content`)
                })

                if (confirmed) {
                    await SasTradingGoodData.deleteGood(goodId)
                    this.render()
                }
                break
            case 'confirm-create':
                const newGood = this.options.newGoods[goodId]
                if (!newGood.name) {
                    SasTrading.error('cannot create trade good without a name', newGood)
                    ui.notifications.error(SasTrading.localize(`${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_GOODS}.${SasTrading.SETTINGS.NOTIFICATIONS}.no-name`))
                    break
                }
                const city = clickedElement.parents('[data-good-city]')?.data()?.goodCity
                await SasTradingGoodData.createGood({
                    name: newGood.name,
                    city: city,
                    demand: newGood.demand,
                    scarcity: newGood.scarcity
                })
                // Delete the new good from the list now that it exists in the trade goods list
                this.deleteNewGood(goodId)
                
                this.render()
                break
            case 'cancel-create':
                this.deleteNewGood(goodId)
                this.render()
                break
        }
    }

    /**
     * Helper to delete new goods from the list.
     * @param {string} newGoodId 
     */
    deleteNewGood(newGoodId) {
        this.options.newGoods = foundry.utils.mergeObject(this.options.newGoods, {[`-=${newGoodId}`]: null}, {performDeletions: true})
    }
}

class SasTradingBaseGoodConfig extends FormApplication {
    static get defaultOptions() {
        const defaults = super.defaultOptions
        const overrides = {
            height: 'auto',
            width: '500',
            id: 'sas-trading-base-good-config',
            title: SasTrading.localize(`${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_BASE}.title`),
            template: SasTrading.TEMPLATES.CONFIG_BASE,
            closeOnSubmit: false,
            submitOnChange: true,
            resizable: true,
            scrollY: ['[save-scroll-existing=true]', '[save-scroll-new=true]'],
            newGoods: {}
        }
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides)

        return mergedOptions
    }

    getData(options) {
        const baseGoods = SasTradingBaseGoodData.allBaseGoodsList
        return {
            baseGoods: baseGoods,
            numBaseGoods: baseGoods.length,
            newGoods: options.newGoods
        }
    }

    async _updateObject(event, formData) {
        const expandedData = foundry.utils.expandObject(formData)

        // 1. Update existing base good values
        if (!expandedData.existing || Object.keys(expandedData.existing).length === 0) {
            SasTrading.log(false, 'form data for existing trade good base values was empty', expandedData)
        } else {
            // Sanitize form data here because updateBaseGoods doesn't
            // If any of the values aren't a number, drop them completely
            const badValues = Object.entries(expandedData.existing).filter(([_, value]) => {
                return typeof value !== 'number'
            })
            if (badValues.length > 0) {
                const badValuesUpdate = Object.fromEntries(badValues.map(([name, _]) => {
                    return [`-=${name}`, null]
                }))
                expandedData.existing = foundry.utils.mergeObject(expandedData.existing, badValuesUpdate, {performDeletions: true})
            }
            await SasTradingBaseGoodData.updateBaseGoods(expandedData.existing)
        }

        // 2. Copy new goods fields
        if (!expandedData.new || Object.keys(expandedData.new).length === 0) {
            SasTrading.log(false, 'form data for new trade good base values was empty', expandedData)
        } else {
            this.options.newGoods = foundry.utils.mergeObject(this.options.newGoods, expandedData.new)
        }

        this.render()
    }

    activateListeners(html) {
        super.activateListeners(html)
        html.on('click', '[data-action]', this._handleButtonClick.bind(this))
    }

    async _handleButtonClick(event) {
        const clickedElement = $(event.currentTarget)
        const action = clickedElement.data()?.action
        const baseGoodName = clickedElement.parents('[data-base-good-name]')?.data()?.baseGoodName
        const newGoodId = clickedElement.parents('[data-new-good-id]')?.data()?.newGoodId
    
        switch (action) {
            case 'create':
                const newBaseGoodId = foundry.utils.randomID(16)
                this.options.newGoods[newBaseGoodId] = { id: newBaseGoodId }
                this.render()
                break
            case 'delete':
                const confirmed = await Dialog.confirm({
                    title: SasTrading.localize(`${SasTrading.LANG}.confirms.delete-confirm-good.title`),
                    content: SasTrading.localize(`${SasTrading.LANG}.confirms.delete-confirm-good.content`)
                })

                if (confirmed) {
                    await SasTradingBaseGoodData.deleteBaseGood(baseGoodName)
                    this.render()
                }
                break
            case 'confirm-create':
                const newGood = this.options.newGoods[newGoodId]
                if (!newGood.name) {
                    SasTrading.error('cannot create trade good without a name', newGood)
                    ui.notifications.error(SasTrading.localize(`${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_BASE}.${SasTrading.SETTINGS.NOTIFICATIONS}.no-name`))
                    break
                }
                if (!newGood.value) {
                    SasTrading.error('cannot create trade good without a value', newGood)
                    ui.notifications.error(SasTrading.localize(`${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_BASE}.${SasTrading.SETTINGS.NOTIFICATIONS}.no-value`))
                    break
                }
                if (typeof newGood.value !== 'number') {
                    SasTrading.error('trade good must have a number value', newGood)
                    ui.notifications.error(SasTrading.localize(`${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_BASE}.${SasTrading.SETTINGS.NOTIFICATIONS}.nan`))
                    break
                }
                await SasTradingBaseGoodData.createBaseGood(newGood.name, newGood.value)
                this.deleteNewGood(newGoodId)
                this.render()
                break
            case 'cancel-create':
                this.deleteNewGood(newGoodId)
                this.render()
                break
        }
    }

    /**
     * Helper to delete new goods from the temporary list.
     * @param {string} newGoodId 
     */
    deleteNewGood(newGoodId) {
        this.options.newGoods = foundry.utils.mergeObject(this.options.newGoods, {[`-=${newGoodId}`]: null}, {performDeletions: true})
    }
}

class SasTradingCitiesConfig extends FormApplication {
    static get defaultOptions() {
        const defaults = super.defaultOptions
        const overrides = {
            height: 'auto',
            width: '250',
            id: 'sas-trading-cities-config',
            title: SasTrading.localize(`${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_CITIES}.title`),
            template: SasTrading.TEMPLATES.CONFIG_CITIES,
            closeOnSubmit: false,
            submitOnChange: true,
            resizable: true,
            scrollY: ['[save-scroll-existing=true]', '[save-scroll-new=true]'],
            newCities: {}
        }
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides)

        return mergedOptions
    }

    getData(options) {
        return {
            cities: SasTradingCitiesData.allCitiesSorted,
            newCities: options.newCities
        }
    }

    async _updateObject(event, formData) {
        const expandedData = foundry.utils.expandObject(formData)

        // Because cities are immutable, there's no need to update the existing city data

        // 1. Update new cities
        if (!expandedData.new || Object.keys(expandedData.new).length === 0) {
            SasTrading.log(false, 'form data for new cities was empty', expandedData)
        } else {
            this.options.newCities = foundry.utils.mergeObject(this.options.newCities, expandedData.new)
        }

        this.render()
    }

    activateListeners(html) {
        super.activateListeners(html)
        html.on('click', '[data-action]', this._handleButtonClick.bind(this))
    }

    async _handleButtonClick(event) {
        const clickedElement = $(event.currentTarget)
        const action = clickedElement.data()?.action
        const cityName = clickedElement.parents('[data-city-name]')?.data()?.cityName
        const newCityId = clickedElement.parents('[data-new-city-id]')?.data()?.newCityId

        switch (action) {
            case 'create':
                const newlyCreatedCityId = foundry.utils.randomID(16)
                this.options.newCities[newlyCreatedCityId] = { id: newlyCreatedCityId }
                this.render()
                break
            case 'delete':
                const confirmed = await Dialog.confirm({
                    title: SasTrading.localize(`${SasTrading.LANG}.confirms.delete-confirm-city.title`),
                    content: SasTrading.localize(`${SasTrading.LANG}.confirms.delete-confirm-city.content`)
                })
                if (confirmed) {
                    await SasTradingCitiesData.deleteCity(cityName)
                    this.render()
                }
                break
            case 'confirm-create':
                const newCity = this.options.newCities[newCityId]
                if (!newCity.name) {
                    SasTrading.error('cannot create city without a name', newCity)
                    ui.notifications.error(SasTrading.localize(`${SasTrading.LANG}.settings.${SasTrading.SETTINGS.CONFIG}.${SasTrading.SETTINGS.CONFIG_CITIES}.${SasTrading.SETTINGS.NOTIFICATIONS}.no-name`))
                    break
                }
                await SasTradingCitiesData.createCity(newCity.name)
                this.deleteNewCity(newCityId)
                this.render()
                break
            case 'cancel-create':
                this.deleteNewCity(newCityId)
                this.render()
        }
    }

    /**
     * Helper to delete new cities from the list
     * @param {string} newCityId 
     */
    deleteNewCity(newCityId) {
        this.options.newCities = foundry.utils.mergeObject(this.options.newCities, {[`-=${newCityId}`]: null}, {performDeletions: true})
    }
}

class SasTradingMenu extends FormApplication {
    
    static TABS = {
        OVERVIEW: 'sas-trading-menu-overview',
        GATHER_INFO: 'sas-trading-menu-gather-info',
        BUY_SELL: 'sas-trading-menu-buy-sell'
    }
    /**
     * BUY_SELL defines the options for the buy/sell radio buttons.
     */
    static BUY_SELL = Object.freeze({
        BUY: 'buy',
        SELL: 'sell'
    })

    // TODO: make these settings, so they can be changed by the GM
    static BASE_GATHER_INFO_ACCURACY = 70
    static GATHER_INFO_DIPLO_DC = 20
    static BUY_SELL_DIPLO_DC = 25
    static DEMAND_MODS = {
        [SasTradingGoodData.demand.HIGH]: 0.1,
        [SasTradingGoodData.demand.AVG]: 0.0,
        [SasTradingGoodData.demand.LOW]: -0.1,
    }
    static SCARCITY_MODS = {
        [SasTradingGoodData.scarcity.RARE]: 0.05,
        [SasTradingGoodData.scarcity.COMMON]: 0.0,
        [SasTradingGoodData.scarcity.ABUNDANT]: -0.05,
    }

    static get defaultOptions() {
        const defaults = super.defaultOptions

        const overrides = {
            height: 'auto',
            width: '600',
            id: 'sas-trading-menu',
            title: SasTrading.localize(`${SasTrading.LANG}.${SasTrading.MENU.TRADE}.title`),
            template: SasTrading.TEMPLATES.MENU,
            closeOnSubmit: false,
            submitOnChange: true,
            resizable: true,
            tabs: [
                {
                    group: 'primary-tabs',
                    navSelector: '.tabs',
                    contentSelector: '.content',
                    initial: this.TABS.OVERVIEW
                }
            ],
            tabData: [
                {
                    id: this.TABS.OVERVIEW,
                    title: `${SasTrading.LANG}.${SasTrading.MENU.TRADE}.${SasTrading.MENU.TRADE_OVERVIEW}.tab-title`,
                    template: SasTrading.TEMPLATES.PARTIALS.MENU_OVERVIEW
                },
                {
                    id: this.TABS.GATHER_INFO,
                    title: `${SasTrading.LANG}.${SasTrading.MENU.TRADE}.${SasTrading.MENU.TRADE_GATHER_INFO}.tab-title`,
                    template: SasTrading.TEMPLATES.PARTIALS.MENU_GATHER_INFO
                },
                {
                    id: this.TABS.BUY_SELL,
                    title: `${SasTrading.LANG}.${SasTrading.MENU.TRADE}.${SasTrading.MENU.TRADE_BUY_SELL}.tab-title`,
                    template: SasTrading.TEMPLATES.PARTIALS.MENU_BUY_SELL
                }
            ],
            activeTab: this.TABS.OVERVIEW,
            selectedBuy: true
        }
        const selectedCity = SasTradingCitiesData.allCitiesSorted[0]
        const updatedOverrides = this.updateSelectedOptions(selectedCity, undefined, overrides)
        const mergedOptions = foundry.utils.mergeObject(defaults, updatedOverrides)

        return mergedOptions
    }

    getData(options) {
        return {
            tabs: options.tabData,
            goodsByCity: options.goodsByCity,
            goodNames: options.goodNames,
            numGoods: options.goodNames.length,
            cities: SasTradingCitiesData.allCitiesSorted,
            selectedCity: options.selectedCity,
            selectedGoodName: options.selectedGoodName,
            selectedGood: options.selectedGood,
            diplomacyRoll: options.diplomacyRoll,
            selectedBuy: options.selectedBuy,
            gatherInfoResult: options.gatherInfoResult,
            buySellResult: options.buySellResult
        }
    }

    async _updateObject(event, formData) {
        const updatedElement = $(event.currentTarget)
        const activeTab = updatedElement.parents('[data-tab]')?.data()?.tab
        const expandedData = foundry.utils.expandObject(formData)
        SasTrading.log(false, 'saving', expandedData)
        // Tabs return similar info through different inputs, so update data based on
        // which tab is selected
        this.updateObjectFromTab(activeTab, expandedData)
        this.render()
    }

    /**
     * updateTabData updates options based on the given tab ID.
     * @param {string} tabId 
     * @param {Object} expandedData formData after it has been expanded by foundry utils
     */
    updateObjectFromTab(tabId, expandedData) {
        switch (tabId) {
            case SasTradingMenu.TABS.OVERVIEW:
                this.options = SasTradingMenu.updateSelectedOptions(expandedData.overview.selectedCity, undefined, this.options)
                break
            case SasTradingMenu.TABS.GATHER_INFO:
                this.options = SasTradingMenu.updateSelectedOptions(expandedData.gatherInfo.selectedCity, expandedData.gatherInfo.selectedGood, this.options)
                this.options.diplomacyRoll = expandedData.gatherInfo.diplomacyRoll
                break
            case SasTradingMenu.TABS.BUY_SELL:
                this.options = SasTradingMenu.updateSelectedOptions(expandedData.buySell.selectedCity, expandedData.buySell.selectedGood, this.options)
                this.options.diplomacyRoll = expandedData.buySell.diplomacyRoll
                this.options.selectedBuy = expandedData.buySell.choice === SasTradingMenu.BUY_SELL.BUY
                break
        }
    }

    activateListeners(html) {
        super.activateListeners(html)
        html.on('click', '[data-action]', this._handleButtonClick.bind(this))
    }

    async _handleButtonClick(event) {
        const clickedElement = $(event.currentTarget)
        const action = clickedElement.data()?.action

        switch (action) {
            case 'gatherInfo-roll':
                // The diplomacy roll is needed for the full evaluation, just break early if it's not in yet
                if (!this.options.diplomacyRoll) {
                    SasTrading.warn(true, 'missing diplomacy roll result')
                    ui.notifications.warn(SasTrading.localize(`${SasTrading.LANG}.${SasTrading.MENU.TRADE}.${SasTrading.MENU.NOTIFICATIONS}.no-diplo-roll`))
                    break
                }
                // The DC for the check is 20, so if it's below that we can keep going, but the result might be innacurate
                if (this.options.diplomacyRoll < SasTradingMenu.GATHER_INFO_DIPLO_DC) {
                    SasTrading.warn(true, 'diplomacy roll was less than 20 for a DC 20 diplomacy check')
                }
                const gatherInfoGood = this.options.selectedGood
                if (!gatherInfoGood.demand) {
                    SasTrading.error('missing trade good demand', gatherInfoGood)
                    ui.notifications.error(SasTrading.localize(`${SasTrading.LANG}.${SasTrading.MENU.TRADE}.${SasTrading.MENU.NOTIFICATIONS}.trade-good-missing-demand`))
                    break
                }
                if (!gatherInfoGood.scarcity) {
                    ui.notifications.error(SasTrading.localize(`${SasTrading.LANG}.${SasTrading.MENU.TRADE}.${SasTrading.MENU.NOTIFICATIONS}.trade-good-missing-scarcity`))
                    SasTrading.error('missing trade good scarcity', gatherInfoGood)
                    break
                }
                const accuracyRoll = new Roll('d100')
                await accuracyRoll.toMessage({}, { rollMode: 'gmroll' })
                // This is the formula for determining whether gathered info is accurate
                // See written rules for more info
                const accuracyThresh = SasTradingMenu.BASE_GATHER_INFO_ACCURACY + (this.options.diplomacyRoll - SasTradingMenu.GATHER_INFO_DIPLO_DC)
                const accurate = accuracyRoll.total <= accuracyThresh
                // If the info was inaccurate, generate random demand and scarcity
                const gatherInfoDemand = accurate ? gatherInfoGood.demand : SasTrading.randomProperty(SasTradingGoodData.demand)[1]
                const gatherInfoScarcity = accurate ? gatherInfoGood.scarcity : SasTrading.randomProperty(SasTradingGoodData.scarcity)[1]
                this.options.gatherInfoResult = {
                    good: this.options.selectedGoodName,
                    demand: gatherInfoDemand,
                    scarcity: gatherInfoScarcity,
                    baseAccuracy: SasTradingMenu.BASE_GATHER_INFO_ACCURACY,
                    diploDc: SasTradingMenu.GATHER_INFO_DIPLO_DC,
                    diplomacyRoll: this.options.diplomacyRoll,
                    accuracyThresh: accuracyThresh,
                    accuracyRoll: accuracyRoll.total,
                    accurate: accurate,
                }
                this.render()
                // TODO: ChatMessage.create() to create a message
                // create takes an object with at least the field "content"
                // I think I can call renderTemplate("path-to-template", {data for template}) to fill in content
                ChatMessage.create({
                    content: await renderTemplate(SasTrading.TEMPLATES.CHAT.GATHER_INFO, this.options),
                    speaker: {alias: SasTrading.localize(`${SasTrading.LANG}.module-short`)}
                })
                break
            case 'gatherInfo-close':
                this.options.gatherInfoResult = undefined
                this.render()
                break
            case 'buySell-getPrice':
                // The diplomacy roll is needed for the full evaluation, just break early if it's not in yet
                if (!this.options.diplomacyRoll) {
                    SasTrading.warn(true, 'missing diplomacy roll result')
                    ui.notifications.warn(SasTrading.localize(`${SasTrading.LANG}.${SasTrading.MENU.TRADE}.${SasTrading.MENU.NOTIFICATIONS}.no-diplo-roll`))
                    break
                }
                // Ensure a good is selected and all required properties exist
                if (!this.options.selectedGood) {
                    SasTrading.warn(true, 'missing trade good', this.options.selectedGood)
                    ui.notifications.warn(SasTrading.localize(`${SasTrading.LANG}.${SasTrading.MENU.TRADE}.${SasTrading.MENU.NOTIFICATIONS}.no-trade-good`))
                    break
                }
                const buySellGood = this.options.selectedGood
                if (!buySellGood.value) {
                    SasTrading.error('missing trade good value', buySellGood)
                    ui.notifications.error(SasTrading.localize(`${SasTrading.LANG}.${SasTrading.MENU.TRADE}.${SasTrading.MENU.NOTIFICATIONS}.trade-good-missing-value`))
                    break
                }
                if (!buySellGood.demand) {
                    SasTrading.error('missing trade good demand', buySellGood)
                    ui.notifications.error(SasTrading.localize(`${SasTrading.LANG}.${SasTrading.MENU.TRADE}.${SasTrading.MENU.NOTIFICATIONS}.trade-good-missing-demand`))
                    break
                }
                if (!buySellGood.scarcity) {
                    ui.notifications.error(SasTrading.localize(`${SasTrading.LANG}.${SasTrading.MENU.TRADE}.${SasTrading.MENU.NOTIFICATIONS}.trade-good-missing-scarcity`))
                    SasTrading.error('missing trade good scarcity', buySellGood)
                    break
                }

                // This is the formula for determining the final buy/sell price of a trade good
                // See written rules for more info
                const buySellDemandMod = SasTradingMenu.DEMAND_MODS[buySellGood.demand]
                const buySellScarictyMod = SasTradingMenu.SCARCITY_MODS[buySellGood.scarcity]
                // buySellDiploMod increases or decrease the price based on whether players are selling or buying, respectively
                const buySellDiploMod = ((this.options.selectedBuy ? -1 : 1) * (this.options.diplomacyRoll - SasTradingMenu.BUY_SELL_DIPLO_DC)) / 100.0
                // finalGoodValue factors in all the mods at once
                const buySellFinalValue = buySellGood.value + (buySellGood.value * (buySellDemandMod + buySellScarictyMod + buySellDiploMod))
                this.options.buySellResult = {
                    price: buySellFinalValue,
                    good: buySellGood.name,
                    value: buySellGood.value,
                    buy: this.options.selectedBuy,
                    demandMod: buySellDemandMod,
                    scarcityMod: Math.abs(buySellScarictyMod),
                    scarcityPos: buySellScarictyMod >= 0,
                    diploMod: buySellDiploMod
                }
                this.render()
                break
            case 'buySell-close':
                this.options.buySellResult = undefined
                this.render()
                break
        }
    }

    /**
     * updateSelected updates options using selections from the trading menu.
     * 
     * It updates the following values using the options { overwrite: true, recursive: false }
     *   - selectedCity
     *   - goodNames
     *   - goodsByCity
     *   - selectedGoodName
     *   - selectedGood
     * @param {SasCityName} selectedCity 
     * @param {SasGoodName|undefined} selectedGoodName 
     * @param {Object} options The options to update
     * @returns {Object} The updated options object. That is, the options after they have been merged with updates
     */
    static updateSelectedOptions(selectedCity, selectedGoodName, options) {
        const goodsByCity = SasTradingGoodData.goodsByCity[selectedCity] || {}
        const baseGoods = SasTradingBaseGoodData.allBaseGoods
        const goodNames = Object.keys(goodsByCity)
        goodNames.forEach(name => {
            goodsByCity[name].value = baseGoods[name]
        })
        // Try updating the selected good name based on the list if there isn't one already
        // This way, if a city has no goods and a new city is selected with goods, it pulls the first
        // good from the list.
        // If a good is already selected, just carry it over
        const resolvedSelectedGoodName = selectedGoodName ? selectedGoodName :
            (goodsByCity ? Object.keys(goodsByCity)[0] : "")
        // If there's no good selected, set it to undefined. This way the handlebars template can check
        // and display a placeholder table until one is selected.
        const selectedGood = resolvedSelectedGoodName ? goodsByCity[resolvedSelectedGoodName] : undefined

        const updatedOptions = {
            selectedCity: selectedCity,
            goodNames: goodNames,
            goodsByCity: goodsByCity,
            selectedGoodName: resolvedSelectedGoodName,
            selectedGood: selectedGood
        }
        return foundry.utils.mergeObject(options, updatedOptions, { overwrite: true, recursive: false })
    }
}

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(SasTrading.ID)
})

Hooks.once('init', () => {
    SasTrading.initialize()
})
