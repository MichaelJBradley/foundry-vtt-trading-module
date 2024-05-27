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
        CONFIG_CITIES: `modules/${this.ID}/templates/sas-cities-config.hbs` 
    }
    static SETTINGS = {
        GOODS: 'goods',           // see {SasGoods}
        BASE_GOODS: 'base-goods', // see {SasBaseGood}
        CITIES: 'cities',         // see {SasCities}
        // Lang refs
        CONFIG: 'config',
        CONFIG_GOODS: 'goods-menu',
        CONFIG_BASE: 'base-goods-menu',
        CONFIG_CITIES: 'cities-menu'
    }

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

    static initialize() {
        this.registerSettings()
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
            SasTrading.log(false, 'good must have at least name and city properties', good)
            return
        }
        if (!good.id) {
            good.id = this.goodId(good.name, good.city)
        } else if (good.id !== this.goodId(good.name, good.city)) {
            SasTrading.log(false, 'good.id "', good.id, '" does not match expected id:', this.goodId(good.name, good.city))
            return
        }

        const goods = this.allGoods
        if (goods.hasOwnProperty(good.id)) {
            SasTrading.log(false, 'good already exists:', good.id)
            // TODO: Application Warning? Error?
            return
        }

        goods[good.id] = good
        return SasTrading.setSetting(SasTrading.SETTINGS.GOODS, goods)
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
            SasTrading.log(false, 'good.id does not match id:', id, good)
            return
        }
        // If good name and city are provided, they must result in the same ID
        if ((good.name && good.city) && id !== this.goodId(good.name, good.city)) {
            SasTrading.log(false, 'provided good name and city do not match id:', id, good)
            return
        }
        const goods = this.allGoods
        if (!goods.hasOwnProperty(id)) {
            SasTrading.log(false, 'good does not exist:', id)
            // TODO: Application warning? Error?
            return
        }
        // Name and city can never change
        if (good.name && good.name !== goods[id].name) {
            SasTrading.log(false, 'cannot change name:', 'provided:', good, 'existing:', goods[id])
            return
        }
        if (good.city && good.city !== goods[id].city) {
            SasTrading.log(false, 'cannot change city:', 'provided:', good, 'existing:', goods[id])
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
            SasTrading.log(false, 'good does not exist:', id)
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
            SasTrading.log(false, 'good with does not exist with id:', id)
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
            SasTrading.log(false, 'base good already exists:', goodName)
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
            SasTrading.log(false, 'base good does not exist with name:', goodName)
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
            SasTrading.log(false, 'base good does not exist with name:', goodName)
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
            SasTrading.log(false, 'base good does not exist with name:', goodName)
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
            SasTrading.log(false, 'city already exists:', cityName)
            return
        }

        cities.push(cityName)
        return SasTrading.setSetting(SasTrading.SETTINGS.CITIES, cities)
    }

    static deleteCity(cityName) {
        const cities = this.allCities
        if (!cities.includes(cityName)) {
            SasTrading.log(false, 'city does not exist with name:', cityName)
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
            selectedCity: SasTradingCitiesData.allCitiesSorted[0],
            newGoods: {},
        }
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides)

        return mergedOptions
    }

    getData(options) {
        const goodsByCity = SasTradingGoodData.goodsByCity[options.selectedCity] || {}
        return {
            goodsByCity: goodsByCity,
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
            SasTrading.log(false, 'form data for existing trade goods was empty')
        } else {
            await SasTradingGoodData.updateGoods(expandedData.existing)
        }

        // 2. Copy new goods fields
        if (!expandedData.new || Object.keys(expandedData.new).length === 0) {
            SasTrading.log(false, 'form data for new trade goods was empty')
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
                    SasTrading.log(false, 'cannot create trade good without a name', newGood)
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
            newGoods: {}
        }
        const mergedOptions = foundry.utils.mergeObject(defaults, overrides)

        return mergedOptions
    }

    getData(options) {
        return {
            baseGoods: SasTradingBaseGoodData.allBaseGoodsList,
            newGoods: options.newGoods
        }
    }

    async _updateObject(event, formData) {
        const expandedData = foundry.utils.expandObject(formData)

        // 1. Update existing base good values
        if (!expandedData.existing || Object.keys(expandedData.existing).length === 0) {
            SasTrading.log(false, 'form data for existing trade good base values was empty')
        } else {
            // Sanitize form data here because updateBaseGoods doesn't
            // If any of the values aren't a number, drop them completely
            const badValues = Object.entries(expandedData.existing).filter(([name, value]) => {
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
            SasTrading.log(false, 'form data for new trade good base values was empty')
        } else {
            // TODO: Sanitize new goods' values
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
                    SasTrading.log(false, 'cannot create trade good without a name', newGood)
                    break
                }
                if (!newGood.value) {
                    SasTrading.log(false, 'cannot create trade good without a value', newGood)
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

        // Because cities are immutable, there's no need to update the city data

        // 1. Update new cities
        if (!expandedData.new || Object.keys(expandedData.new).length === 0) {
            SasTrading.log(false, 'form data for new cities was empty')
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
                    SasTrading.log(false, 'cannot create city without a name')
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

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(SasTrading.ID)
})

Hooks.once('init', () => {
    SasTrading.initialize()
})
