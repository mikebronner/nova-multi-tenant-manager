<script>
export default {
    data: function () {
        return {
            fields: [],
            imagePreviewData: "",
            newAlias: "",
            tenant: {},
            validationErrors: [],
        };
    },

    mounted() {
        this.loadTenant();
    },

    computed: {
        hasLogo: function () {
            return (((this.tenant.settings || {}).logo || "").length > 0);
        },

        currentImage: function () {
            return (this.imagePreviewData.length > 0
                ? this.imagePreviewData
                : (this.hasLogo
                    ? "/" + this.tenant.settings.logo
                    : ""));
        },
    },

    methods: {
        addAlias: function () {
            var self = this;

            axios.post("/nova-vendor/genealabs-nova-multi-tenant-manager/aliases", {
                    alias: self.newAlias,
                })
                .then(function (response) {
                    self.tenant = response.data;
                    self.newAlias = "";
                })
                .catch(function (error) {
                    console.error(error);
                    self.$toasted.show("Error " + error.response.status + ": " + error.response.statusText, {type: "error"});
                });
        },

        deleteAlias: function (aliasId) {
            var self = this;

            axios.delete("/nova-vendor/genealabs-nova-multi-tenant-manager/aliases/" + aliasId)
                .then(function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        self.tenant.aliases = _.reject(self.tenant.aliases, function (alias) {
                            return alias.id == aliasId;
                        });
                    }
                })
                .catch(function (error) {
                    console.error(error, error.response);
                    self.$toasted.show("Error " + error.response.status + ": " + error.response.statusText, {type: "error"});
                });
        },

        formData: function () {
            let data = new FormData();

            data.append("_method", "PATCH");

            if (this.tenant.name != null) {
                data.append("name", this.tenant.name);
            }

            if (this.tenant.settings.logo != null) {
                data.append("logo", this.tenant.settings.logo);
            }

            return data;
        },

        getName: function () {
            return this.tenant.name;
        },

        loadTenant: function () {
            var self = this;

            axios.get("/nova-vendor/genealabs-nova-multi-tenant-manager/tenants/0")
                .then(function (response) {
                    self.tenant = response.data;
                    self.fields = [
                        {
                            name: "Name",
                            value: self.tenant.name,
                            component: "text-field",
                            resourceName: "Tenant",
                        },
                        {
                            name: "Logo",
                            value: self.tenant.logo,
                            component: "file-field",
                            resourceName: "Tenant",
                        },
                    ];
                })
                .catch(function (error) {
                    console.error(error, error.response);
                    self.$toasted.show("Error " + error.response.status + ": " + error.response.statusText, {type: "error"});
                });
        },

        previewImage: function (event) {
            var input = event.target;
            var self = this;

            if (input.files
                && input.files[0]
            ) {
                var reader = new FileReader();

                this.tenant.settings = Object.assign({}, this.tenant.settings, {
                    logo: input.files[0],
                });
                reader.onload = function (event) {
                    var imageData = event.target.result;
                    self.imagePreviewData = "";

                    if (imageData.indexOf("data:image") === 0) {
                        self.imagePreviewData = imageData;
                    }
                }
                reader.readAsDataURL(input.files[0]);

                this.updateTenant();
            }
        },

        updateTenant: _.debounce(function () {
            var self = this;
            var data = this.formData();

            axios.post(
                    "/nova-vendor/genealabs-nova-multi-tenant-manager/tenants/" + this.tenant.id,
                    data
                )
                .then(function (response) {
                    self.tenant = response.data;
                    self.$toasted.show("Site settings updated successfully.", {type: "success"});
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 1000);
                })
                .catch(function (error) {
                    console.error(error, error.response);
                    self.$toasted.show("Error " + error.response.status + ": " + error.response.statusText, {type: "error"});
                });
        }, 500),
    },
};
</script>

<template>
    <div>
        <heading class="mb-6">Site</heading>
        <card>
            <div>
                <div class="flex border-b border-40" via-resource="" via-resource-id="" via-relationship="">
                    <div class="w-1/5 py-6 px-8">
                        <label class="inline-block text-80 pt-2 leading-tight" for="name">
                            Name
                        </label>
                    </div>
                    <div class="py-6 px-8 w-1/2">
                        <input
                            type="text"
                            placeholder="Name"
                            class="w-full form-control form-input form-input-bordered"
                            v-model="tenant.name"
                            @keyup="updateTenant"
                        >
                        <div class="help-text help-text mt-2">
                        </div>
                    </div>
                </div>
                                <div class="flex border-b border-40" via-resource="" via-resource-id="" via-relationship="">
                    <div class="w-1/5 py-6 px-8">
                        <label class="inline-block text-80 pt-2 leading-tight" for="name">
                            Domain
                        </label>
                    </div>
                    <div class="w-3/4 py-8 px-8">
                        <p class="text-90"
                            v-text="tenant.domain"
                        ></p>
                    </div>
                </div>
                <div class="flex border-b border-40" via-resource="" via-resource-id="" via-relationship="">
                    <div class="w-1/5 py-6 px-8">
                        <label class="inline-block text-80 pt-2 leading-tight" for="name">
                            Aliases
                        </label>
                    </div>
                    <div class="py-8 px-8 w-3/4">
                        <p
                            class="mb-3"
                            v-for="alias in tenant.aliases"
                        >
                            {{ alias.fqdn }}
                            <span class="ml-3 text-danger trashcan"
                                @click="deleteAlias(alias.id)"
                            >
                                <i class="fal fa-trash-alt"></i>
                                <i class="fas fa-trash-alt"></i>
                            </span>
                        </p>
                        <input
                            type="text"
                            placeholder="Add Alias"
                            class="w-2/3 form-control form-input form-input-bordered rounded-r-none"
                            v-model="newAlias"
                            @keyup.enter="addAlias"
                        ><button
                            class="btn btn-default btn-primary rounded-l-none"
                            @click="addAlias"
                        >
                            <i class="fas fa-plus"></i>
                        </button>
                        <div class="help-text help-text mt-2">
                        </div>
                    </div>
                </div>
            </div>
        </card>
        <heading class="mb-6 mt-12">Settings</heading>
        <card class="mt-4">
            <div>
                <div class="flex border-b border-40">
                    <div class="w-1/5 py-6 px-8">
                        <label class="inline-block text-80 pt-2 leading-tight">
                            Logo
                        </label>
                    </div>
                    <div class="py-6 px-8 w-4/5">
                        <span class="form-file mr-4">
                            <input
                                type="file"
                                id="logo"
                                class="form-file-input"
                                @change="previewImage"
                                accept="image"
                                ref="logo"
                            >
                            <label>
                                <img class="image-preview"
                                    :src="currentImage"
                                >
                            </label>
                            <div></div>
                            <label
                                for="logo"
                                class="mt-4 form-file-btn btn btn-default btn-primary"
                            >
                                Choose File
                            </label>
                        </span>
                        <div class="help-text help-text mt-2">
                            Current File: {{ tenant.logo || "no file selected" }}
                        </div>
                    </div>
                </div>
            </div>
        </card>
    </div>
</template>

<style scoped lang="scss">
    .trashcan {
        cursor: pointer;

        i:first-child {
            display: inline-block;
        }

        i:last-child {
            display: none;
        }

        &:hover {
            i:first-child {
                display: none;
            }

            i:last-child {
                display: inline-block;
            }
        }
    }
</style>
